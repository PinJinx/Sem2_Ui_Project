import requests
import os
import time
from pathlib import Path

def fetch_wallpapers(api_key, query="phone wallpaper", per_page=10, orientation="portrait"):
    """
    Fetch phone wallpaper images from Pexels API
    
    Parameters:
    - api_key: Your Pexels API key
    - query: Search term for wallpapers
    - per_page: Number of images to fetch (max 80 per request)
    - orientation: Image orientation (portrait, landscape, square)
    
    Returns:
    - List of image data dictionaries
    """
    headers = {
        "Authorization": api_key
    }
    
    url = "https://api.pexels.com/v1/search"
    params = {
        "query": query,
        "per_page": per_page,
        "orientation": orientation
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return response.json()["photos"]
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return []

def download_image(url, folder_path, filename):
    """
    Download an image from a URL and save it to the specified path
    
    Parameters:
    - url: URL of the image to download
    - folder_path: Path to save the image to
    - filename: Filename to save the image as
    
    Returns:
    - Path to the downloaded image
    """
    # Create folder if it doesn't exist
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        
    full_path = os.path.join(folder_path, filename)
    
    # Download the image
    response = requests.get(url, stream=True)
    
    if response.status_code == 200:
        with open(full_path, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        return full_path
    else:
        print(f"Failed to download image: {response.status_code}")
        return None

def main():
    # Replace with your actual Pexels API key
    API_KEY = "CAYgBjro3HlMMWOOkHHImSvfeybbT4FQabmLsNOoupFLvUqDFlXBDg2Q"  # Get this from https://www.pexels.com/api/
    
    # Search parameters
    search_term = input("Enter search term (default: 'phone wallpaper'): ") or "phone wallpaper"
    num_images = int(input("Number of images to download (default: 5): ") or "5")
    orientation = input("Orientation (portrait/landscape/square, default: portrait): ") or "portrait"
    download_folder = input("Download folder (default: 'wallpapers'): ") or "wallpapers"
    
    # Create download folder
    download_path = Path(download_folder)
    download_path.mkdir(exist_ok=True)
    
    print(f"\nFetching {num_images} {orientation} wallpapers for '{search_term}'...")
    
    # Fetch images
    photos = fetch_wallpapers(API_KEY, search_term, num_images, orientation)
    
    if not photos:
        print("No images found!")
        return
    
    # Download images
    downloaded_count = 0
    for i, photo in enumerate(photos):
        # Get image details
        image_url = photo["src"]["original"]  # Original high-res image
        photographer = photo["photographer"]
        photo_id = photo["id"]
        
        # Create filename
        filename = f"{search_term.replace(' ', '_')}_{photo_id}.jpg"
        
        # Download the image
        print(f"Downloading image {i+1}/{len(photos)}: {filename}")
        path = download_image(image_url, download_folder, filename)
        
        if path:
            downloaded_count += 1
            print(f"Downloaded: {path} (by {photographer})")
            # Add small delay to be nice to Pexels API
            time.sleep(0.5)
    
    print(f"\nDownloaded {downloaded_count} wallpapers to '{download_folder}' folder!")
    print("Remember to credit Pexels and the photographers if you share or use these images.")

if __name__ == "__main__":
    main()