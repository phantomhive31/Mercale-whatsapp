import { Request, Response } from "express";
import Product from "../models/Product";
import AppError from "../errors/AppError";
import { Op } from "sequelize";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { searchParam, page } = req.query;

  const whereCondition: any = {
    companyId,
    active: true
  };

  if (searchParam) {
    whereCondition.name = {
      [Op.like]: `%${searchParam}%`
    };
  }

  const limit = 20;
  const offset = limit * (+page - 1);

  const products = await Product.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["name", "ASC"]]
  });

  const hasMore = products.count > offset + products.rows.length;

  return res.json({ products: products.rows, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const productData = { ...req.body, companyId };

  const product = await Product.create(productData);

  return res.status(201).json(product);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const product = await Product.findOne({
    where: { id, companyId }
  });

  if (!product) {
    throw new AppError("ERR_PRODUCT_NOT_FOUND", 404);
  }

  return res.json(product);
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;
  const productData = req.body;

  const product = await Product.findOne({
    where: { id, companyId }
  });

  if (!product) {
    throw new AppError("ERR_PRODUCT_NOT_FOUND", 404);
  }

  await product.update(productData);

  return res.json(product);
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  const product = await Product.findOne({
    where: { id, companyId }
  });

  if (!product) {
    throw new AppError("ERR_PRODUCT_NOT_FOUND", 404);
  }

  // Soft delete - apenas marca como inativo
  await product.update({ active: false });

  return res.status(200).json({ message: "Product deleted successfully" });
};

export const search = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { q } = req.query;

  if (!q) {
    return res.json({ products: [] });
  }

  const products = await Product.findAll({
    where: {
      companyId,
      active: true,
      [Op.or]: [
        { name: { [Op.iLike]: `%${q}%` } },
        { category: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } }
      ]
    },
    limit: 10,
    order: [["name", "ASC"]]
  });

  return res.json({ products });
};
