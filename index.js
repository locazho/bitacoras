const FS = require('fs');
const XLSX = require("node-xlsx");

/*
DIRECTORIOS DONDE SE BUSCARÁN ARCHIVOS.
*/
const DIRECTORIOS = [
`D:/DROPBOX_MIEL/TO_DISK`,
`D:/DROPBOX_MIEL/Dropbox/NODE_JS_MIEL`
];

/*
ARREGLO DE EXPRESIONES REGULARES PARA VERIFICAR QUE TIPOS DE ARCHIVO SE DESEAN INCLUIR
*/
const TIPOS_ARCHIVO = [
    /\.(z|Z)(i|I)(p|P)$/
];

/*
DIRECTORIO DONE SE GUARDARA EL XLSX
*/
const DIRECTORIO_DESTINO_XLSX = `../BITACORA.xlsx`

/*
INFORMACION PARA RELLENAR CAMPOS DE LA BITACORA
*/
const DESCRIPCION = {
    SISTEMA : 'BACKEND',
    ENCARGADO : 'Bryant Marcelo Pérez Rodríguez',
    CARGO : 'Full Stack Developer'
};

/*
DATOS A GUARDAR EN EL EXCEL
*/
var DATOS_EXCEL = [
    ['NOMBRE DE ARCHIVO', 'FECHA DE CREACION DE ARCHIVO', 'TAMAÑO DE ARCHIVO (BYTES)', 'TAMAÑO DE ARCHIVO' , 'SISTEMA', 'ENCARGADO' , 'CARGO']
];


COMENZAR();

function COMENZAR(){
    console.dir('*** Bienvenido oh Perozoso Capitán ***');
    DIRECTORIOS.forEach( (DIRECTORIO) => {
        LEER_DIRECTORIO(DIRECTORIO);
    });
    CREAR_EXCEL();
    
}

function LEER_DIRECTORIO(DIRECTORIO){
    try{
        let ARCHIVOS=FS.readdirSync(DIRECTORIO);
        ARCHIVOS.forEach( (ARCHIVO) => {
            if(VERIFICAR_TIPO(ARCHIVO)){
                let INFORMACION = FS.statSync(`${DIRECTORIO}/${ARCHIVO}`);
                DATOS_EXCEL.push(
                    [ARCHIVO, INFORMACION.birthtime, INFORMACION.size, TAMANO_BYTES(INFORMACION.size) , DESCRIPCION.SISTEMA, DESCRIPCION.ENCARGADO, DESCRIPCION.CARGO]
                );
            }
        });
    }catch (e){
        console.dir(':( REVENTE EN UN DIRECTORIO...');
        console.dir(e);
    }
}

function VERIFICAR_TIPO(ARCHIVO){
    let VALIDEZ=false;
    for( let i=0; i < TIPOS_ARCHIVO.length; i++){
        if(TIPOS_ARCHIVO[i].test(ARCHIVO)){
            VALIDEZ=true;
            break;
        }
    }
    return VALIDEZ;
}

function TAMANO_BYTES(BYTES) {
    let TAMANOS = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (BYTES == 0) {
        return 'SIN TAMAÑO'
    };
    let i = parseInt(Math.floor(Math.log(BYTES) / Math.log(1024)));
    if (i == 0) {
        return BYTES + ' ' + TAMANOS[i];
    }
    return (BYTES / Math.pow(1024, i)).toFixed(2) + ' ' + TAMANOS[i];
};

function CREAR_EXCEL(){
    let BUFFER = XLSX.build([{ name: "Bitácora de Respaldos", data: DATOS_EXCEL }]);
    FS.writeFile(DIRECTORIO_DESTINO_XLSX, BUFFER, (ERROR) => {
        if(!ERROR){
            console.dir('*** Creación de Bitácora Finalizada :)***');
            setTimeout(()=> {}, 10000);
        }else{
            console.dir(':( REVENTE AL CREAR LA BITACORA...');
            console.dir(ERROR);
        }
    });
}