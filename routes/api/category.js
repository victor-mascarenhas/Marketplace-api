const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Category = require('../../models/category');
const Product = require('../../models/product');
const MSGS = require('../../messages')
const auth = require('../../middleware/auth');


//@route  POST /category
//@desc   CREATE category
//@acess  Public
router.post('/', [
    check('name', "Name Required").not().isEmpty()
], auth, async (req, res, next) => {
    try {
        let { name } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        } else {
            let category = new Category({ name })

            await category.save()
            if (category.id) {
                res.status(201).json(category);
            }
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send({ 'error': MSGS.GENERIC_ERROR })
    }
})

//@route   GET/category
//@desc    LIST category
//@access  Public
router.get('/', async (req, res, next) => {
    try {
        const category = await Category.find({})
        res.json(category)
    } catch (err) {
        console.error(err.message)
        res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }

})

//@route   GET/category/:id
//@desc    DETAIL category
//@access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const category = await Category.findOne({ _id: id })
        if (category) {
            res.json(category)
        } else {
            res.status(404).send({ "error": MSGS.CATEGORY_404 })
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }

})

//@route   DELETE/category/:id
//@desc    DELETE category
//@access  Public
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const id = req.params.id
        let category = await Category.findOne({ _id: id })
        if (category) {
            const productsByCategory = await Product.find({ category: category._id })
            if (productsByCategory.lentgh > 0) {
                res.status(400).send({ "error": MSGS.CANTDELETE })
            } else {
                await Category.findOneAndDelete({ _id: id })
                res.json(category)
            }
        } else {
            res.status(404).send({ "error": MSGS.CATEGORY_404 })
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }

})

//@route   PATCH/category/:id
//@desc    PARTIAL UPDATE category
//@access  Public
router.patch('/:id', auth, async (req, res, next) => {
    try {
        const id = req.params.id
        const update = { $set: req.body }
        const category = await Category.findByIdAndUpdate(id, update, { new: true })
        if (category) {
            res.json(category)
        } else {
            res.status(404).send({ "error": MSGS.CATEGORY_404 })
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }

})


module.exports = router;