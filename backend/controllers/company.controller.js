import { Company } from '../models/company.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinaryUpload.js';

export const registerCompany = asyncHandler(async (req, res) => {
    const { name, website, industry, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Company name is required");
    }

    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
        throw new ApiError(409, "Company already exists");
    }

    let logoUrl = '';
    if (req.file) {
        const logoLocalPath = req.file.path;
        const logo = await uploadOnCloudinary(logoLocalPath);
        if (logo) logoUrl = logo.url;
    }

    const company = await Company.create({
        name,
        website,
        industry,
        description,
        logo: logoUrl
    });

    return res.status(201).json(new ApiResponse(201, company, "Company registered successfully"));
});

export const getCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find();
    return res.status(200).json(new ApiResponse(200, companies, "Companies fetched successfully"));
});

export const getCompanyById = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);
    if (!company) throw new ApiError(404, "Company not found");
    return res.status(200).json(new ApiResponse(200, company, "Company fetched successfully"));
});
