# WizardLM-7B-Uncensored Interface

A minimal web interface for interacting with the [WizardLM-7B-Uncensored](https://huggingface.co/cognitivecomputations/WizardLM-7B-Uncensored) model.

## Features

- Simple chat interface
- Adjustable generation parameters
- Responsive design
- Kaggle notebook compatibility

## Setup Options

### Option 1: Web Application

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/wizardlm-uncensored-interface.git
   cd wizardlm-uncensored-interface
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the application:
   ```
   python app.py
   ```

4. Open your browser and navigate to `http://localhost:5000`

### Option 2: Kaggle Notebook

1. Upload the `kaggle_wizardlm.ipynb` file to Kaggle
2. Make sure to enable GPU acceleration in the notebook settings
3. Run all cells to start the interface

## Deployment on Codesphere

This application is designed to be easily deployed on Codesphere.

1. Create a new project on Codesphere
2. Connect your GitHub repository
3. Set up the environment with Python
4. Install dependencies using `pip install -r requirements.txt`
5. Start the application with `python app.py`

## Note on Model Usage

This interface uses WizardLM-7B-Uncensored, which has no built-in guardrails. As noted by the model creators:

> An uncensored model has no guardrails. You are responsible for anything you do with the model, just as you are responsible for anything you do with any dangerous object such as a knife, gun, lighter, or car.
>
> Publishing anything this model generates is the same as publishing it yourself.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 