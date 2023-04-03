const multer = require("multer");
const fs = require("fs");
const path = require("path");

const getFileType = (file) => {
  const mimeType = file.mimetype.split("/");
  return mimeType[mimeType.length - 1];
};

const generateFileName = (req, file, cb) => {
  const extension = getFileType(file);
  const fileName =
    require("crypto").randomBytes(8).toString("hex") + "." + extension;

  cb(null, file.fieldname + "-" + fileName);
};

const fileFilter = (req, file, cb) => {
  const extension = getFileType(file);

  const allowedType = /jpeg|jpg|png/;

  const passed = allowedType.test(extension);

  if (passed) {
    return cb(null, true);
  }

  return cb(null, false);
};

exports.userFile = ((req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { id } = req.user;
      const dest = `uploads/user/${id}`;

      fs.access(dest, (error) => {
        // if doesn't exist
        if (error) {
          return fs.mkdir(dest, (error) => {
            cb(error, dest);
          });
        } else {
          // it does exist
          fs.readdir(dest, (err, files) => {
            if (err) throw err;

            for (const file of files) {
              fs.unlink(path.join(dest, file), (err) => {
                if (err) throw err;
              });
            }
          });

          return cb(null, dest);
        }
      });
    },
    filename: generateFileName,
  });
  return multer({ storage }).single("avatar");
})();

exports.chatFile = ((req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { id } = req.body;
      const dest = `uploads/chat/${id}`;

      fs.access(dest, (error) => {
        // if doens't exist
        if (error) {
          return fs.mkdir(dest, (error) => {
            cb(error, dest);
          });
        } else {
          return cb(null, dest);
        }
      });
    },
    filename: generateFileName,
  });

  return multer({ storage, fileFilter }).single("image");
})();
