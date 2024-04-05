require 'nokogiri'
require 'json'

module MyAPI
  IIFE_PATTERN = /\(function\(\)\{var s='([^']+)';var ii=\[([^\]]+)\];_setImagesSrc\(ii,s\);\}\)\(\);/m

  def self.extract_iife_objects(doc)
    iife_objects = []
    doc.css('script').each do |script|
      script_content = script.text
      script_content.scan(IIFE_PATTERN) do |s, ii|
        cleaned_ii = ii.split(",").map { |item| item.strip.gsub(/'/, '') }
        iife_objects << { s: s, ii: cleaned_ii }
      end
    end
    iife_objects
  end

  def self.extract_element_info(doc, iife_objects)
    extracted_info = []
    div = doc.at('.wDYxhc')

    div.css('a').each do |element|
      name = element.at('.pgNMRc').text
      year = element.at('.cxzHyb').text
      extensions = [year]

      link = "https://www.google.com#{element.attr('href')}"
      image = nil
      id = element.at('img').attr('id')
      iife_objects.each do |current|
        if current[:ii][0] == id
          image = current[:s]
          break
        end
      end
      object = { name: name, extensions: extensions, link: link, image: image }
      extracted_info << object
    end
    extracted_info
  end

  def self.extract_information_from_google_search(html_file)
    begin
      content = File.read(html_file)
      doc = Nokogiri.HTML(content)
      iife_objects = extract_iife_objects(doc)
      element_info = extract_element_info(doc, iife_objects)
      return element_info.to_json
    rescue StandardError => e
      puts "Error extracting information: #{e.message}"
      return []
    end
  end

end

filename = 'files/basquiat-paintings.html'
puts MyAPI.extract_information_from_google_search(filename)