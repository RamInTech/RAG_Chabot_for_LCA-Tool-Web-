from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import torch
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
from sentence_transformers import SentenceTransformer
import chromadb
from pypdf import PdfReader
from datasets import Dataset
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pdf_path = 'ML_Model/Aluminium.pdf'

def setup_flan():
    model_name = 'sentence-transformers/all-MiniLM-L6-v2'
    embedding_model = SentenceTransformer(model_name)

    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
    except FileNotFoundError:
        text = "Aluminium is a lightweight metal used in various industries. It is produced from bauxite ore through the Bayer process. Recycling aluminium saves energy."

    def split_text_into_chunks(text, chunk_size=500, chunk_overlap=50):
        chunks = []
        current_pos = 0
        while current_pos < len(text):
            end_pos = current_pos + chunk_size
            chunk = text[current_pos:end_pos]
            chunks.append(chunk)
            current_pos += chunk_size - chunk_overlap
        return [chunk for chunk in chunks if chunk.strip()]

    text_chunks = split_text_into_chunks(text)
    dataset = Dataset.from_dict({'text': text_chunks})
    embeddings = embedding_model.encode(dataset['text'], show_progress_bar=False)
    dataset = dataset.add_column('embeddings', embeddings.tolist())

    client = chromadb.Client()
    collection = client.get_or_create_collection(name="aluminium_kb")
    doc_ids = [str(i) for i in range(len(dataset))]
    documents_list = [doc for doc in dataset['text']]
    collection.add(embeddings=np.array(dataset['embeddings']), documents=documents_list, ids=doc_ids)

    llm_pipeline = pipeline('text2text-generation', model='google/flan-t5-large', tokenizer='google/flan-t5-large')
    return embedding_model, collection, llm_pipeline

def setup_llama():
    device = torch.device("cpu")  # Use CPU to avoid MPS issues

    embedding_model_name = 'BAAI/bge-large-en-v1.5'
    embedding_model = SentenceTransformer(embedding_model_name, device=device)

    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
    except FileNotFoundError:
        text = "Aluminium is a lightweight metal used in various industries. It is produced from bauxite ore through the Bayer process. Recycling aluminium saves energy."

    def split_text_into_chunks(text, chunk_size=500, chunk_overlap=50):
        chunks = []
        current_pos = 0
        while current_pos < len(text):
            end_pos = current_pos + chunk_size
            chunk = text[current_pos:end_pos]
            chunks.append(chunk)
            current_pos += chunk_size - chunk_overlap
        return [chunk for chunk in chunks if chunk.strip()]

    text_chunks = split_text_into_chunks(text)
    dataset = Dataset.from_dict({'text': text_chunks})
    embeddings = embedding_model.encode(dataset['text'], show_progress_bar=False)
    dataset = dataset.add_column('embeddings', embeddings.tolist())

    client = chromadb.Client()
    collection = client.get_or_create_collection(name="aluminium_kb_v2")
    doc_ids = [str(i) for i in range(len(dataset))]
    documents_list = [doc for doc in dataset['text']]
    collection.add(embeddings=np.array(dataset['embeddings']), documents=documents_list, ids=doc_ids)

    llm_model_name = 'unsloth/llama-3-8b-Instruct'
    tokenizer = AutoTokenizer.from_pretrained(llm_model_name)
    model = AutoModelForCausalLM.from_pretrained(llm_model_name, torch_dtype=torch.float16)
    model.to(device)
    llm_pipeline = pipeline('text-generation', model=model, tokenizer=tokenizer)
    return embedding_model, collection, llm_pipeline, tokenizer, device

print("Loading Flan model...")
flan_emb, flan_col, flan_llm = setup_flan()
print("Loading Llama model...")
llama_emb, llama_col, llama_llm, llama_tok, device = setup_llama()

models = {
    'flan': (flan_emb, flan_col, flan_llm),
    'llama': (llama_emb, llama_col, llama_llm, llama_tok, device)
}

def retrieve_context(query, embedding_model, collection, k=3):
    query_embedding = embedding_model.encode([query]).tolist()
    results = collection.query(query_embeddings=query_embedding, n_results=k)
    retrieved_chunks = results['documents'][0]
    return " ".join(retrieved_chunks)

def generate_answer_flan(query, context, llm_pipeline):
    prompt = f"""
You are a helpful assistant. Based on the following context, provide a comprehensive, detailed, and natural-sounding answer to the question. Explain your answer step by step if necessary.

Context:
{context}

Question:
{query}

Answer:
"""
    result = llm_pipeline(prompt, max_length=512, min_length=50, do_sample=True, temperature=0.7, top_p=0.9, clean_up_tokenization_spaces=True)
    return result[0]['generated_text']

def generate_answer_llama(query, context, llm_pipeline, tokenizer, device):
    messages = [
        {"role": "system", "content": "You are a helpful assistant. Answer the user's question based on the provided context."},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
    ]
    prompt = llm_pipeline.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    terminators = [
        llm_pipeline.tokenizer.eos_token_id,
        llm_pipeline.tokenizer.convert_tokens_to_ids("<|eot_id|>")
    ]
    outputs = llm_pipeline(prompt, max_new_tokens=256, eos_token_id=terminators, do_sample=True, temperature=0.6, top_p=0.9)
    generated_text = outputs[0]['generated_text']
    response = generated_text[len(prompt):].strip()
    return response

class ChatRequest(BaseModel):
    query: str
    model: str  # 'flan' or 'llama'

@app.post("/chat")
def chat(request: ChatRequest):
    if request.model == 'flan':
        emb, col, llm = models['flan']
        context = retrieve_context(request.query, emb, col)
        answer = generate_answer_flan(request.query, context, llm)
    elif request.model == 'llama':
        emb, col, llm, tok, dev = models['llama']
        context = retrieve_context(request.query, emb, col)
        answer = generate_answer_llama(request.query, context, llm, tok, dev)
    else:
        return {"error": "Invalid model"}
    return {"answer": answer}
