class ZipJob
  include SuckerPunch::Job

  def perform(id_export)
    require 'zip'
    export = Export.find(id_export)

    folder = "/home/ruby/TMP/zip/"
    input_filenames = ['drush', 'error1.jpg', 'errorLog.txt','php.ini']

    zipfile_name = "/home/ruby/Proyectos/Personales/slideme/public/zip/archive.zip"

    Zip::File.open(zipfile_name, Zip::File::CREATE) do |zipfile|
      input_filenames.each do |filename|
        # Two arguments:
        # - The name of the file as it will appear in the archive
        # - The original file, including the path to find it
        zipfile.add(filename, folder + '/' + filename)
      end
    end

    export.url = zipfile_name
    export.save

  end
end