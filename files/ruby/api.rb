require 'nokogiri'
require 'json'

module MyAPI
  IIFE_PATTERN = /\(function\(\)\{var s='([^']+)';var ii=\[([^\]]+)\];_setImagesSrc\(ii,s\);\}\)\(\);/m

  def self.extract_iife_objects(doc)
    begin
      iife_objects = []
      doc.css('script').each do |script|
        script_content = script.text
        script_content.scan(IIFE_PATTERN) do |s, ii|
          cleaned_ii = ii.split(",").map { |item| item.strip.gsub(/'/, '') }
          iife_objects << { s: s, ii: cleaned_ii[0] }
        end
      end
      iife_objects
    rescue StandardError => e
      puts "Error extracting iife objects: #{e.message}"
      return {}
    end
  end

  def self.extract_element_info(element, iife_objects)
    begin
      name = element.at('.pgNMRc').text
      year = element.at('.cxzHyb').text
      extensions = [year]

      link = "https://www.google.com#{element.attr('href')}"
      image = nil
      id = element.at('img').attr('id')
      iife_objects.each do |current|
        if current[:ii] == id
          image = current[:s]
          break
        end
      end
      object = { name: name, extensions: extensions, link: link, image: image }
      return object
    rescue StandardError => e
      puts "Error extracting element information: #{e.message}"
      return {}
    end
  end

  def self.extract_information_from_google_search(file_name)
    begin
      html_content = File.read(file_name)
      doc = Nokogiri.HTML(html_content)
      iife_objects = extract_iife_objects(doc)
      extracted_info = []
      div = doc.at('.wDYxhc')

      div.css('a').each do |element|
        info = extract_element_info(element, iife_objects)
        extracted_info << info
      end

      return extracted_info
    rescue StandardError => e
      puts "Error extracting information: #{e.message}"
      return []
    end
  end

end
