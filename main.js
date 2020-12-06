const electron=require('electron');
const url=require('url');
const path=require('path');

const {app,BrowserWindow,Menu,ipcMain}=electron;
let mainWindow;
let addWindow;

app.on('ready',function(){
    mainWindow=new BrowserWindow({ 
        webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    }});
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname,'mainWindows.html'),
        protocol:'file:',
        slashes:true
    }));
    //Ana sayfa kapatıldığı zaman uygulamadan çıkıyor.
    mainWindow.on('closed',function(){
        app.quit();
    })
    //https://www.electronjs.org/docs/api/menu 
    //Dökümanlardan bakabilirsin.
    const mainMenu=Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

//Olayı burada kullanıyoruz.(2)
function createAddWindow(){
    //Yeni bir pencere oluşturuyoruz.
    addWindow=new BrowserWindow({
        //Yükseklik ve genişlik  ve başlık veriyoruz.
        width:500,
        height:500,
        title:'Add shopping List İtem',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    //AddWindow değişkeni yüklendiği zaman hangi sayfayı çalıştıracak onu belirliyoruz.
    addWindow.loadURL(url.format({
        pathname:path.join(__dirname,'addWindows.html'),
        protocol:'file:',
        slashes:true
    }));
    addWindow.on('close',function(){
        addWindow=null;
    });
}

ipcMain.on('item:add',function(e,item){
    console.log(item);
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
})

//Üst menüye kendimiz ayar veriyoruz.
const mainMenuTemplate=[

    {
        label:'File',
        submenu:[
           {
               label:'Add item',
               click(){
                   createAddWindow();//Olaya bağladık.(1)
               }
           },
           {
               label:'Clear İtems' 
           },
           {
               label:'Quit',

               //Kodu yazarken else==: anlamına gelir;Mac ve Windows quit ayarları yapıldı.

               accelerator:process.platform=='darwin' ? 'Command+Q':'Ctrl+Q',
               click(){
                   app.quit();
               }
           }

        ]
    }
];
if(process.platform=='darwin'){
    mainMenuTemplate.unshift();
}

if(process.env.NODE_ENV !=='production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[
            {
            label:'Toggle DevTools',
            accelerator:process.platform=='darwin' ? 'Command+I':'Ctrl+I',
            click(item,focusedWindow){
                console.log(item);
                focusedWindow.toggleDevTools();
            }          
        },
        {
            role:'reload'
        }        
    ]
    });
}