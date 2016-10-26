require 'zip'

class ZipJob
  include SuckerPunch::Job

  def perform(id_export)
    export = Export.find(id_export)
    deck = Deck.find(export.deck)
    user = User.find(export.user)

    dir_output = Rails.public_path.join('zip/'+user.get_name)
    zipfile_name = dir_output.join(deck.slug + '.zip')

    if not Dir.exist?(dir_output)
      Dir.mkdir(dir_output,7777)
    end
    #zipfile_name = '/home/ruby/Proyectos/slideme' + '/public/zip/'+ user.get_name + '/' + deck.slug + '.zip'

    zf = ZipFileGenerator.new( Rails.root.join('public/deveal/bower_components/headjs'), zipfile_name)
    zf.write()
=begin
    input_filenames = ['drush', 'error1.jpg', 'errorLog.txt', 'php.ini']

    Zip::File.open(@zipfile_name, Zip::File::CREATE) do |zipfile|
      input_filenames.each do |filename|
        # Two arguments:
        # - The name of the file as it will appear in the archive
        # - The original file, including the path to find it
        zipfile.add(filename, folder + '/' + filename)
      end
    end
=end

    export.url = '/public/zip/' + user.get_name + '/' + deck.slug + '.zip'
    export.save

  end

=begin
  private
  # Zip the input directory.
  def add_directory(dir)
    entries = Dir.entries(dir) - %w(. ..)
    ::Zip::File.open(@zipfile_name, ::Zip::File::CREATE) do |io|
      write_entries entries, '', io
    end
  end

  # A helper method to make the recursion work.
  def write_entries(entries, path, io)
    entries.each do |e|
      zip_file_path = path == '' ? e : File.join(path, e)
      disk_file_path = File.join(@input_dir, zip_file_path)
      puts "Deflating #{disk_file_path}"

      if File.directory? disk_file_path
        recursively_deflate_directory(disk_file_path, io, zip_file_path)
      else
        put_into_archive(disk_file_path, io, zip_file_path)
      end
    end
  end

  def recursively_deflate_directory(disk_file_path, io, zip_file_path)
    io.mkdir zip_file_path
    subdir = Dir.entries(disk_file_path) - %w(. ..)
    write_entries subdir, zip_file_path, io
  end

  def put_into_archive(disk_file_path, io, zip_file_path)
    io.get_output_stream(zip_file_path) do |f|
      f.puts(File.open(disk_file_path, 'rb').read)
    end
  end
=end

end

class ZipFileGenerator
  # Initialize with the directory to zip and the location of the output archive.
  def initialize(input_dir, output_file)
    @input_dir = input_dir
    @output_file = output_file
  end

  # Zip the input directory.
  def write
    entries = Dir.entries(@input_dir) - %w(. ..)

    ::Zip::File.open(@output_file, ::Zip::File::CREATE) do |io|
      write_entries entries, '', io
    end
  end

  private

  # A helper method to make the recursion work.
  def write_entries(entries, path, io)
    entries.each do |e|
      zip_file_path = path == '' ? e : File.join(path, e)
      disk_file_path = File.join(@input_dir, zip_file_path)
      puts "Deflating #{disk_file_path}"

      if File.directory? disk_file_path
        recursively_deflate_directory(disk_file_path, io, zip_file_path)
      else
        put_into_archive(disk_file_path, io, zip_file_path)
      end
    end
  end

  def recursively_deflate_directory(disk_file_path, io, zip_file_path)
    io.mkdir zip_file_path
    subdir = Dir.entries(disk_file_path) - %w(. ..)
    write_entries subdir, zip_file_path, io
  end

  def put_into_archive(disk_file_path, io, zip_file_path)
    io.get_output_stream(zip_file_path) do |f|
      f.puts(File.open(disk_file_path, 'rb').read)
    end
  end
end

