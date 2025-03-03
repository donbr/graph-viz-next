import os
import argparse

def get_ts_tsx_files(directory, exclude_dirs=('node_modules',), file_extensions=('.ts', '.tsx', '.js', '.jsx')):
    file_data = {}
    
    for root, dirs, files in os.walk(directory):
        # Modify dirs in-place to exclude directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file.endswith(file_extensions):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        file_data[file_path] = f.read()
                except Exception as e:
                    file_data[file_path] = f"Error reading file: {e}"
    
    return file_data

def save_to_text_file(output_file, file_data):
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"Application Source Code - {len(file_data)} files\n")
        f.write("=" * 100 + "\n\n")
        
        for file_path, content in file_data.items():
            f.write(f"File: {file_path}\n")
            f.write("-" * 80 + "\n")
            f.write(content + "\n\n")
            f.write("=" * 100 + "\n\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Extract source files into a single text document.')
    parser.add_argument('--directory', '-d', default='src', 
                        help='Directory to search for source files (default: src)')
    parser.add_argument('--output', '-o', default='info.txt',
                        help='Output file path (default: info.txt)')
    parser.add_argument('--exclude', '-x', default='node_modules',
                        help='Comma-separated list of directories to exclude (default: node_modules)')
    parser.add_argument('--extensions', '-e', default='.ts,.tsx,.js,.jsx',
                        help='Comma-separated list of file extensions (default: .ts,.tsx,.js,.jsx)')
    
    args = parser.parse_args()
    
    # Convert comma-separated strings to tuples
    exclude_dirs = tuple(args.exclude.split(','))
    file_extensions = tuple(args.extensions.split(','))
    
    # Get file data
    file_data = get_ts_tsx_files(args.directory, exclude_dirs, file_extensions)
    save_to_text_file(args.output, file_data)
    
    print(f"Processed {len(file_data)} files from '{args.directory}'")
    print(f"Excluded directories: {exclude_dirs}")
    print(f"Included extensions: {file_extensions}")
    print(f"Data saved to '{args.output}'")