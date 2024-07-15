import os
import pandas as pd
from PIL import Image

# Define the input CSV file path and the output folder
csv_file_path = '../nodejs/server/api/src/data/whells_data.csv'
output_folder = '../datasets/wheels'


# # Ensure the output folder exists
# os.makedirs(output_folder, exist_ok=True)

# # Read the CSV file
# df = pd.read_csv(csv_file_path, header=None)
# df.columns = ['id', 'timestamp', 'image_path', 'x1', 'y1', 'x2', 'y2']

# # Iterate through each row in the DataFrame
# for index, row in df.iterrows():
#     image_path = row['image_path']
#     x1 = row['x1']
#     y1 = row['y1']
#     x2 = row['x2']
#     y2 = row['y2']
    
#     try:
#         # Open the image
#         with Image.open(image_path) as img:
#             # Calculate the bounding box coordinates
#             left = x1
#             upper = y1
#             right = x2
#             lower = y2
            
#             # Crop the image
#             cropped_img = img.crop((left, upper, right, lower))
            
#             # Create a new name for the cropped image
#             base_name = os.path.basename(image_path)
#             name, ext = os.path.splitext(base_name)
#             new_image_name = f"{name}_cropped_{index}{ext}"
#             output_image_path = os.path.join(output_folder, new_image_name)
            
#             # Save the cropped image
#             cropped_img.save(output_image_path)
            
#             print(f"Cropped image saved to {output_image_path}")
#     except Exception as e:
#         print(f"Error processing image {image_path}: {e}")

# print("All images processed.")











train_folder = os.path.join(output_folder, 'training')
val_folder = os.path.join(output_folder, 'validation')

# Ensure the output folders exist
os.makedirs(train_folder, exist_ok=True)
os.makedirs(val_folder, exist_ok=True)

# Read the CSV file
df = pd.read_csv(csv_file_path, header=None)
df.columns = ['id', 'timestamp', 'image_path', 'x1', 'y1', 'x2', 'y2']

# Shuffle the DataFrame
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Calculate the split index
split_index = int(len(df) * 0.7)

# Split the DataFrame into training and validation sets
train_df = df.iloc[:split_index]
val_df = df.iloc[split_index:]


def process_images(dataframe, folder, csv_filename):
    csv_rows = []

    for index, row in dataframe.iterrows():
        image_path = row['image_path']
        x1 = row['x1']
        y1 = row['y1']
        x2 = row['x2']
        y2 = row['y2']
        
        try:
            # Open the image
            with Image.open(image_path) as img:
                # Crop the image using the provided coordinates
                cropped_img = img.crop((x1, y1, x2, y2))
                
                # Create a new name for the cropped image
                base_name = os.path.basename(image_path)
                name, ext = os.path.splitext(base_name)
                new_image_name = f"croppedImage-{index}{ext}"
                output_image_path = os.path.join(folder, new_image_name)
                
                # Save the cropped image
                cropped_img.save(output_image_path)
                
                # Add the new image name and label to the CSV rows
                csv_rows.append([new_image_name, 'no-wide'])
                
                print(f"Cropped image saved to {output_image_path}")
        except Exception as e:
            print(f"Error processing image {image_path}: {e}")

    # Write the CSV file
    csv_file_path = os.path.join(output_folder, csv_filename)
    csv_df = pd.DataFrame(csv_rows, columns=['image_name', 'label'])
    csv_df.to_csv(csv_file_path, index=False)
    print(f"CSV file saved to {csv_file_path}")

# Process training images and create training CSV
process_images(train_df, train_folder, 'training.csv')

# Process validation images and create validation CSV
process_images(val_df, val_folder, 'validation.csv')


print("All images processed and CSV files created.")
