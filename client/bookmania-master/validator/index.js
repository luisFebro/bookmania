exports.userSignupValidator = (req, res, next) => {
    req.check("name", "É preciso um nome").notEmpty();
    req.check("email", "Email deve ter de 4 a 32 characteres")
        .matches(/.+\@.+\..+/)
        .withMessage("Email deve conter @")
        .isLength({
            min: 4,
            max: 32
        });
    req.check("password", "A senha é obrigatória").notEmpty();
    req.check("password")
        .isLength({ min: 6 })
        .withMessage("A senha dever conter pelo menos 6 characteres")
        .matches(/\d/)
        .withMessage("A senha deve conter, pelo menos, um número.");
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};
