require_relative 'api'
require 'rspec'

filename = 'files/van-gogh-paintings.html'

RSpec.describe 'API' do
  describe '#extract_iife_objects' do
    it 'returns an array of objects' do

      expect(MyAPI.extract_information_from_google_search(filename)).to be_an_instance_of(Array)
    end
  end
end