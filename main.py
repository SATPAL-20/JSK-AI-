import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Model and tokenizer names
adapters_name = "1littlecoder/mistral-7b-mj-finetuned"
model_name = "bn22/Mistral-7B-Instruct-v0.1-sharded"

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

# Load the tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Load the model
model = AutoModelForCausalLM.from_pretrained(model_name)
model = model.to(device)

print(f"Successfully loaded the model {model_name} into memory")

# Prompt the user to enter the input text
user_input = input("Enter your input: ")

# Replace [INST] and [/INST] with user's input
input_text = f"{user_input}"

# Encode the input text
encoded = tokenizer(input_text, return_tensors="pt", add_special_tokens=False)
model_input = encoded.to(device)

# Generate output using the encoded input
generated_ids = model.generate(**model_input, max_length=200, do_sample=True)
decoded = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
print("Generated output:", decoded)
