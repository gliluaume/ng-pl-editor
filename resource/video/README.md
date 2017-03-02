# exiftool

Exemple de fichier de configuration :
```
%Image::ExifTool::UserDefined = (
    'Image::ExifTool::IPTC::ApplicationRecord' => {
        240 => {
            Name => 'description',
            Format => 'string[0,100]',
        },
    },
);
1; #end
```

Ajout d'une valeur de tag dans une vidéo :
```
exiftool -config exifTool.config -description="ma description" ./CAP_0001_180630.mp4
```