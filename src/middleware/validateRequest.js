const validateRequest = (schema) => {
  return (req, res, next) => {
    // تأكد أن السكيما مررت بشكل صحيح
    if (!schema) {
      return res.status(500).json({
        message: "Internal Server Error: Schema is missing",
        status: "500 Internal Server Error",
      });
    }

    // فحص البيانات (body)
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Zod يضع الأخطاء في مصفوفة اسمها errors
      // نستخدم الـ Optional Chaining (?.) للأمان
      const firstError =
        result.error?.errors?.[0]?.message || "Validation Error";

      return res.status(400).json({
        message: firstError,
        status: "400 Bad Request",
      });
    }

    // تحديث البيانات بالبيانات النظيفة (مهم لـ Zod)
    req.body = result.data;
    next();
  };
};

module.exports = { validateRequest };
