import { Request, Response } from 'express';
import { Categories } from '../../database/models';
import { category } from '../../interface';

exports.getAllCategories = (req: Request, res: Response, next: any) => {
  Categories.find({})
    .then((data: any) => res.status(200).jsonp(data))
    .catch((err: any) => res.status(400).jsonp(err));
};

exports.createCategory = (req: Request, res: Response, next: any) => {
  let newCategory = new Categories({
    name: req.body.name,
    parent: req.body.parent,
  });

  newCategory
    .save()
    .then((data: any) => res.status(201).jsonp(data))
    .catch((err: any) => res.status(400).jsonp(err));
};

exports.getSingleCategory = (req: Request, res: Response, next: any) => {
  Categories.findOne({ _id: req.params.id })
    .then((data: any) => res.status(200).jsonp(data))
    .catch((err: any) => res.status(400).jsonp(err));
};

exports.editCategory = (req: Request, res: Response, next: any) => {
  Categories.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: req.body,
    }
  )
    .then((data: any) => res.status(200).jsonp(data))
    .catch((err: any) => res.status(400).jsonp(err));
};

exports.deleteCategory = (req: Request, res: Response, next: any) => {
  Categories.findOneAndDelete({
    _id: req.params.id,
  }).then(() =>
    res.status(202).jsonp({
      status: 'SUCCESS',
      message: 'Category deleted with all sub-category and data with it.',
    })
  );
};
