import json
import os
import time
from hashlib import sha256

def calculate_statistics(level_data):
    """
    Calculate min, max, and average times for each level.
    
    Args:
    level_data (list of dict): List containing level time data.

    Returns:
    dict: A dictionary with level numbers as keys and their statistics as values.
    """
    level_stats = {}
    
    for entry in level_data:
        level = entry['level']
        time_elapsed = entry['time_elapsed']
        
        if level not in level_stats:
            level_stats[level] = {
                'min_time': time_elapsed,
                'max_time': time_elapsed,
                'total_time': time_elapsed,
                'count': 1
            }
        else:
            stats = level_stats[level]
            stats['min_time'] = min(stats['min_time'], time_elapsed)
            stats['max_time'] = max(stats['max_time'], time_elapsed)
            stats['total_time'] += time_elapsed
            stats['count'] += 1
    
    # Calculate average times
    for level, stats in level_stats.items():
        stats['avg_time'] = round(stats['total_time'] / stats['count'])  # Round to nearest whole number
        del stats['total_time']
        del stats['count']
    
    return level_stats


def get_file_hash(file_path):
    """
    Calculate SHA-256 hash of a file's contents.
    
    Args:
    file_path (str): Path to the file.

    Returns:
    str: SHA-256 hash of the file's contents.
    """
    hasher = sha256()
    try:
        with open(file_path, 'rb') as file:
            while chunk := file.read(8192):
                hasher.update(chunk)
    except FileNotFoundError:
        return None
    return hasher.hexdigest()

def update_level_stats():
    """
    Update level statistics in level_stats.json based on level_data.json.
    """
    try:
        # Load level data
        with open('level_data.json', 'r') as file:
            level_data = json.load(file)
        
        # Calculate statistics
        level_stats = calculate_statistics(level_data)
        
        # Save statistics to file
        with open('../src/level_stats.json', 'w') as file:
            json.dump(level_stats, file, indent=4)
        
        print("Level statistics updated successfully.")
    
    except FileNotFoundError as e:
        print(f"File not found: {e}")
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

def monitor_file(file_path, interval=10):
    """
    Monitor a file for changes and update statistics when the file changes.
    
    Args:
    file_path (str): Path to the file to monitor.
    interval (int): Time in seconds between checks.
    """
    last_hash = get_file_hash(file_path)
    
    while True:
        time.sleep(interval)
        current_hash = get_file_hash(file_path)
        
        if current_hash != last_hash:
            print(f"Change detected in {file_path}. Updating level statistics...")
            update_level_stats()
            last_hash = current_hash

if __name__ == '__main__':
    monitor_file('level_data.json')
