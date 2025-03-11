import cv2
import numpy as np
import pyperclip 

img = cv2.imread('maze_designs/Mazerift-Maze-designs/10.png', cv2.IMREAD_GRAYSCALE)

height, width = img.shape

block_size = 30 

grid_height = height // block_size
grid_width = width // block_size

maze_matrix = []

for i in range(grid_height):
    row = []
    for j in range(grid_width):
        block = img[i*block_size:(i+1)*block_size, j*block_size:(j+1)*block_size]
        
        if np.any(block < 128):
            row.append(1)
        else:
            row.append(0)
    maze_matrix.append(row)

print(maze_matrix)

import json
matrix_str = json.dumps(maze_matrix)

pyperclip.copy(matrix_str)
print("Maze matrix copied to clipboard as Python list format!")