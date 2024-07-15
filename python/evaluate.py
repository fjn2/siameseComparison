import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt
import json

img_width, img_height = 224, 224

# Load the trained model
model = load_model('image25_classification.h5')

def identify_bike(img_path):
    img = image.load_img(img_path, target_size=(img_width, img_height))

    # plt.figure(figsize=(10,10))
    # plt.imshow(img)
    # plt.show()
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0

    prediction = model.predict(img_array)
    # if prediction[0] > 0.5:
    #     print("This is Bike A")
    # else:
    #     print("This is another bike")
    return prediction

# Test the function
prediction = identify_bike('images/016.jpg')

# Convert NumPy arrays to Python lists
output_jsonable = [arr.tolist() for arr in prediction]

# Convert to JSON format
json_output = json.dumps(output_jsonable)

# Print the JSON formatted output
print(json_output)

# 0 -> airplane
# 1 -> automobile
# 3 -> cat
# 4 -> deer
# 6 -> frog
# 7 -> horse
# 8 -> ship
# 9 -> truk