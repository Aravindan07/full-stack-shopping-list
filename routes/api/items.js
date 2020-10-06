const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Item Model
const Item = require('../../models/item');

//@route   GET api/items
//@desc    Get all items
//@access  Public(for now)

router.get('/', (req, res, next) => {
    Item.find()
        .sort({ date: -1 })
        .then((items) => {
            return res.json(items);
        })
        .catch((err) => {
            res.json({ error: err });
        });
});

//@route   POST api/items
//@desc    Create an Item
//@access  Private

router.post('/', auth, (req, res, next) => {
    const newItem = new Item({
        name: req.body.name,
    });
    newItem
        .save()
        .then((item) => res.json(item))
        .catch((err) => res.json({ error: err }));
});

//@route   DELETE api/items
//@desc    Delete an Item
//@access  Private

router.delete('/:ItemId', auth, (req, res, next) => {
    const id = req.params.ItemId;
    Item.remove({ _id: id })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Item Deleted Successfully',
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;
