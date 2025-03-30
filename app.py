from flask import Flask, render_template, request, jsonify
import model_utils
import os
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Initialize model
model = None
tokenizer = None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    global model, tokenizer
    
    # Load model on first request
    if model is None or tokenizer is None:
        model, tokenizer = model_utils.load_model()
    
    data = request.json
    prompt = data.get('prompt', '')
    max_length = int(data.get('max_length', 512))
    temperature = float(data.get('temperature', 0.7))
    top_p = float(data.get('top_p', 0.9))
    
    try:
        response = model_utils.generate_text(
            model, 
            tokenizer, 
            prompt, 
            max_length=max_length,
            temperature=temperature,
            top_p=top_p
        )
        return jsonify({'response': response})
    except Exception as e:
        logging.error(f"Error generating response: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False) 