#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <iomanip>

std::string timeConvert(std::string);

int main() {
    std::fstream fs;
    std::ofstream output;
    int yearInput;

    // Input Here!
    fs.open("Crime_Data_from_2020_to_Present.csv");
    output.open("Processed_Data_2022.csv");
    yearInput = 2022;
    
    if (!fs.is_open()) 
    {
        std::cerr << "Failed to open the file." << std::endl;
        return 1;
    }

    std::vector<std::string> row;
    std::string line, word;

    // output file
    if (!output.is_open()) 
    {
        std::cerr << "Failed to create the output file." << std::endl;
        return 1;
    }

    // Process the header
    if (std::getline(fs, line)) 
    {
        std::stringstream s(line);
        while (std::getline(s, word, ',')) 
        {
            row.push_back(word);
            //std::cout << word << std::endl;
        }
    }
    for (size_t i = 0; i < row.size(); ++i) 
    {
        output << row[i];
        if (i < row.size() - 1) 
        {
            output << ',';
        }
    }
    output << std::endl;

    // Process data rows
    while (std::getline(fs, line)) 
    {
        std::stringstream s(line);
        row.clear();
        while (std::getline(s, word, ',')) {
            row.push_back(word);
            //std::cout << word << std::endl;
        }
        row[1] = timeConvert(row[1]);
        row[2] = timeConvert(row[2]);

        std::stringstream ss(row[1]);
        int year;
        ss >> year;  

        if(year == yearInput)
        {
            for (size_t i = 0; i < row.size(); ++i) {
                output << row[i];
                if (i < row.size() - 1) 
                {
                    output << ',';
                }
            }
            output << std::endl;
        }
        
    }
    output.close();
    fs.close();
    return 0;
}

std::string timeConvert(std::string inputDateTime) 
{
    std::tm tm = {};
    std::stringstream ss(inputDateTime);
    ss >> std::get_time(&tm, "%m/%d/%Y %I:%M:%S %p");

    if (ss.fail()) 
    {
        std::cerr << "Failed to parse the date and time." << std::endl;
        return "";
    }

    std::stringstream formattedDateTime;
    formattedDateTime << std::put_time(&tm, "%Y-%m-%d %H:%M:%S");
    std::string outputDateTime = formattedDateTime.str();

    return outputDateTime;
}