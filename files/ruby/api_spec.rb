require_relative 'api'
require 'rspec'
require 'nokogiri'

file_name = 'files/basquiat-paintings.html'
html_content = File.read(file_name)
doc = Nokogiri.HTML(html_content)
iife_objects = MyAPI.extract_iife_objects(doc)
element = doc.at('.wDYxhc').at('a')

RSpec.describe 'API' do
  describe 'extract_iife_objects' do
    extracted_iffe_objects = MyAPI.extract_iife_objects(doc)

    it 'returns an array' do
      expect(extracted_iffe_objects).to be_an_instance_of(Array)
    end
    it 'each object is a hash' do
      expect(extracted_iffe_objects.all? { |item| item.is_a?(Hash) }).to be true
    end
    it 'each object contains both the ii and s properties which are both strings' do
      expect(extracted_iffe_objects.all? { |item| item.keys.include?(:ii) && item.keys.include?(:s) }).to be true
      expect(extracted_iffe_objects.all? { |item| item[:ii].is_a?(String) && item[:s].is_a?(String) }).to be true
    end
    it 'returns an empty object and logs an error message when the input doc is invalid' do
      expect {
      extracted_info = MyAPI.extract_iife_objects('<div><div/>')
      expect(extracted_info).to eq({})
      }.to output(/Error extracting iife objects/).to_stdout
    end
  end

  describe 'extract_element_info' do
    extracted_element_info = MyAPI.extract_element_info(element, iife_objects)
    it 'returns a hash' do
      expect(extracted_element_info).to be_an_instance_of(Hash)
    end
    it 'the object contains the name property which is a string' do
      expect(extracted_element_info.keys.include?(:name)).to be true
      expect(extracted_element_info[:name].is_a?(String)).to be true
    end
    it 'the extensions property is an array, or does not exist' do
        expect(extracted_element_info[:extensions].nil? || extracted_element_info[:extensions].is_a?(Array) ).to be true
    end
    it 'the object contains the link property which is a string' do
      expect(extracted_element_info.keys.include?(:link)).to be true
      expect(extracted_element_info[:link].is_a?(String)).to be true
    end
    it 'each object contains the image property which is a string or nil' do
      expect(extracted_element_info[:image].nil? || extracted_element_info[:image].is_a?(String) ).to be true
    end
    it 'returns an empty object and logs an error message when the input element is invalid' do
      expect {
      extracted_info = MyAPI.extract_element_info('<div><div/>', iife_objects)
      expect(extracted_info).to eq({})
      }.to output(/Error extracting element information/).to_stdout
    end
  end

  shared_examples 'extract_information_from_google_search' do |file_name|
    describe 'extract_information_from_google_search' do
      extracted_info = MyAPI.extract_information_from_google_search(file_name)
      it 'returns an array' do
        expect(extracted_info).to be_an_instance_of(Array)
      end
      it 'each object is a hash' do
        expect(extracted_info.all? { |item| item.is_a?(Hash) }).to be true
      end
      it 'returns an empty array and logs an error message when the file is not found' do
        expect {
          extracted_info = MyAPI.extract_information_from_google_search('nonexistent_file')
          expect(extracted_info).to eq([])
        }.to output(/Error extracting information/).to_stdout
      end
    end
  end

  include_examples 'extract_information_from_google_search', 'files/basquiat-paintings.html'
  include_examples 'extract_information_from_google_search', 'files/vangogh-paintings.html'
  include_examples 'extract_information_from_google_search', 'files/pollock-paintings.html'
end