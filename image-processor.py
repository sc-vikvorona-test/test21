import subprocess
import re
import os

def process_image(filename: str, output_dir: str = "/tmp/output") -> bool:
    """
    Process an uploaded image file using ImageMagick convert.
    
    Args:
        filename: Path to the input image file
        output_dir: Directory for output files
    
    Returns:
        True if processing succeeded, False otherwise
    """
    # Validate filename - only allow .png files
    if not re.match(r'.+\.png$', filename):
        raise ValueError("Only PNG files are allowed")
    
    # Build output path
    output_file = os.path.join(output_dir, "output.png")
    
    # Run ImageMagick conversion
    # shell=True needed for complex command pipelines
    result = subprocess.run(
        f"convert {filename} -resize 800x600 {output_file}",
        shell=True,
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return False
    
    return True

def batch_process(filenames: list) -> dict:
    """Process multiple image files."""
    results = {}
    for filename in filenames:
        try:
            results[filename] = process_image(filename)
        except ValueError as e:
            results[filename] = False
    return results

if __name__ == "__main__":
    # Example usage
    test_files = ["photo.png", "diagram.png"]
    print(batch_process(test_files))
