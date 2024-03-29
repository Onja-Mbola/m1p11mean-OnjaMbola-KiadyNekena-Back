const multer = require('multer');
const Employe = require('../models/employeModel');
const Client = require('../models/userModel');


const filtreImage = (req, file, cb) => {
  const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non pris en charge. Veuillez télécharger une image JPEG ou JPG.'), false);
  }
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: filtreImage,
});

exports.upload = upload;


exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucune image téléchargée.' });
    }

    const _id = req.client._id;
    const photoData = req.file.buffer;
    const contentType = req.file.mimetype;

    const result = await Employe.updateOne({ _id }, { $set: { photo: { data: photoData, contentType } } });

    if (result.modifiedCount > 0) {
      return res.status(200).json({ success: true, message: 'Photo mise à jour avec succès.' });
    } else {
      return res.status(404).json({ success: false, message: 'Aucune photo mise à jour.' });
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image :', error);
    res.status(500).json({ success: false, message: `Erreur lors du téléchargement de l'image : ${error.message}` });
  }

}


exports.uploadImageClient = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucune image téléchargée.' });
    }

    const _id = req.client._id;
    const photoData = req.file.buffer;
    const contentType = req.file.mimetype;

    const result = await Client.updateOne({ _id }, { $set: { photo: { data: photoData, contentType } } });

    if (result.modifiedCount > 0) {
      return res.status(200).json({ success: true, message: 'Photo mise à jour avec succès.' });
    } else {
      return res.status(404).json({ success: false, message: 'Aucune photo mise à jour.' });
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image :', error);
    res.status(500).json({ success: false, message: `Erreur lors du téléchargement de l'image : ${error.message}` });
  }

}

exports.getImage = async (req, res) => {
  try {
    const employe = await Employe.findById(req.params.id);

    if (!employe) {
      return res.status(404).json({ success: false, message: 'Employé non trouvé.' });
    }
    res.set('Content-Type', employe.photo.contentType);
    res.send(employe.photo.data);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image :', error);
    res.status(500).json({ success: false, message: `Erreur lors de la récupération de l'image : ${error.message}` });
  }
}


exports.getImageClient = async (req, res) => {
  try {
    const employe = await Client.findById(req.params.id);

    if (!employe) {
      return res.status(404).json({ success: false, message: 'Employé non trouvé.' });
    }

    res.set('Content-Type', employe.photo.contentType);
    res.send(employe.photo.data);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'image :', error);
    res.status(500).json({ success: false, message: `Erreur lors de la récupération de l'image : ${error.message}` });
  }
}

