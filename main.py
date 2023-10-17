import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Model and tokenizer names
model_name = "bn22/Mistral-7B-Instruct-v0.1-sharded"  # Update with the correct model name
tokenizer_name = "bn22/Mistral-7B-Instruct-v0.1-sharded"  # Update with the correct tokenizer name

# Load the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Prompt the user to enter the input text
user_input = input("Enter your input: ")

# Replace [INST] and [/INST] with user's input
input_text = f"[INST]{user_input}[/INST]"

# Encode the input text
encoded = tokenizer(input_text, return_tensors="pt", add_special_tokens=False)

# Generate output using the encoded input
generated_ids = model.generate(encoded["input_ids"], max_length=200, num_return_sequences=1)
decoded = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)

print(decoded[0])
