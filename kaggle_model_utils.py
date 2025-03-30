from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import logging

def load_model():
    """Load the WizardLM-7B-Uncensored model and tokenizer."""
    logging.info("Loading model and tokenizer...")
    
    model_name = "cognitivecomputations/WizardLM-7B-Uncensored"
    
    # Check if CUDA is available - Kaggle should have GPU
    device = "cuda" if torch.cuda.is_available() else "cpu"
    logging.info(f"Using device: {device}")
    
    # For Kaggle, we can use 8-bit quantization to save memory
    load_in_8bit = device == "cuda"
    
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        # Load model with appropriate settings for Kaggle
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            device_map="auto",
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
            load_in_8bit=load_in_8bit,
            trust_remote_code=True
        )
        
        logging.info("Model and tokenizer loaded successfully")
        return model, tokenizer
    
    except Exception as e:
        logging.error(f"Error loading model: {str(e)}")
        raise

def generate_text(model, tokenizer, prompt, max_length=512, temperature=0.7, top_p=0.9):
    """Generate text based on the given prompt."""
    try:
        # Format the prompt for WizardLM
        formatted_prompt = f"USER: {prompt}\nASSISTANT:"
        
        inputs = tokenizer(formatted_prompt, return_tensors="pt")
        inputs = {k: v.to(model.device) for k, v in inputs.items()}
        
        # Generate response
        with torch.no_grad():
            generation_output = model.generate(
                **inputs,
                max_length=max_length,
                temperature=temperature,
                top_p=top_p,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )
        
        # Decode the generated text
        generated_text = tokenizer.decode(generation_output[0], skip_special_tokens=True)
        
        # Extract only the assistant's response
        response = generated_text.split("ASSISTANT:")[1].strip()
        return response
    
    except Exception as e:
        logging.error(f"Error in text generation: {str(e)}")
        raise 