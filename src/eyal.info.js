
function runReport(){

    const modulesDB = [];
    let result = [];    
    let csv = "Module , Controller , LOC ,  ";

    function buildModuleDB(modules){
        Object.keys(modules).forEach( moduleName => {
            const module = modules[moduleName];
            modulesDB.push(
                {
                    name        : moduleName,
                    controllers : getInfoFromInvokeQueue  (module , '$controllerProvider'   , 'register' ),
                    directives  : getInfoFromInvokeQueue  (module , '$compileProvider'      , 'directive' ),
                    animates    : getInfoFromInvokeQueue  (module , '$animateProvider'      , 'register' ),
                    filters     : getInfoFromInvokeQueue  (module , '$filterProvider'       , 'register' ),
                    factories   : getInfoFromInvokeQueue  (module , '$provide'  , 'factory'  ),
                    services    : getInfoFromInvokeQueue  (module , '$provide'  , 'service'  ),
                    providers   : getInfoFromInvokeQueue  (module , '$provide'  , 'provider' ),
                    values      : getInfoFromInvokeQueue  (module , '$provide'  , 'value'    ),
                    constants   : getInfoFromInvokeQueue  (module , '$provide'  , 'constant' ),
                    runs        : getInfoFromRunBlocks    (module),
                    configs     : getInfoFromConfigBlocks (module),
                    requires    : module.requires 
                }
            )
        });

        return modulesDB;
    }
    function buildResultDB(){
        modulesDB.forEach( moduleInfo => {
            result.push({
                name : moduleInfo.name,
                controllers : getInfo( "controllers" , moduleInfo.controllers),
                directives  : getInfo( "directives"  , moduleInfo.directives),
                animates    : getInfo( "animates"    , moduleInfo.animates),
                filters     : getInfo( "filters"     , moduleInfo.filters),
                factories   : getInfo( "factories"   , moduleInfo.factories),
                services    : getInfo( "services"    , moduleInfo.services),
                providers   : getInfo( "providers"   , moduleInfo.providers),
                values      : getInfo( "values"      , moduleInfo.values),
                constants   : getInfo( "constants"   , moduleInfo.constants),
                runs        : getInfo( "runs"        , moduleInfo.runs),
                configs     : getInfo( "configs"     , moduleInfo.configs),
                requires    : moduleInfo.requires.length,
    
            });
        });
    }

    function getFactoryInfo(module){
        const items = []
        module._invokeQueue.forEach( item => {
            if( item[0] === "$provide" && item[1] === "factory"){
                items.push({
                    name    : item[2][0],
                    fName   : item[2][1].name,
                    fLength : (item[2][1].toString().match(/\n/g) || '').length + 1,
                })
            }
        });
        return items;
    }
    function getInfoFromInvokeQueue( module,  provider , argName ){
        const items = [];
        module._invokeQueue.forEach( item => {
            if( item[0] === provider && item[1] === argName){
                items.push({
                    name     : item[2][0],
                    fnName   : item[2][1].name,
                    fnLength : (item[2][1].toString().match(/\n/g) || '').length + 1,
                });
            }
        });
        return items;
    }
    function getInfoFromRunBlocks( module ) {
        const items = [];
        module._runBlocks.forEach( item => {
            items.push({
                fnName   : item.name,
                fnLength : (item.toString().match(/\n/g) || '').length + 1
            });
        });
        return items;
    }
    function getInfoFromConfigBlocks( module ) {
        const items = [];
        module._configBlocks.forEach( item => {
            items.push({
                fnName   : item[2][0].name,
                fnLength : (item[2][0].toString().match(/\n/g) || '').length + 1
            });
        });
        return items;
    }

    function getInfo( name , array ) {
        const length = array.length;
        let loc = 0;
        array.forEach( item => {
            loc += item.fnLength;
        }); 
        return `${length} , ${loc}`;
    }

    function createCSV(){
        let csvContent = "Modules, Controllers, LOC, Directives, LOC, Animates, LOC, Filters, LOC, Factories, LOC, Services, LOC, Providers, LOC, Values, LOC, Constants, LOC, Runs, LOC, Configs, LOC, Requires \r\n";

        result.forEach(function(rowArray) {
            let row = Object.values(rowArray).join(",");
            csvContent += row + "\r\n";
        });

        console.log(`+++++++++++++++++  Start CSV   +++++++++++++++++`);
        console.log(csvContent);
        console.log(`+++++++++++++++++  End CSV   +++++++++++++++++`);

    }


    
    buildModuleDB(window['evModules']);
    buildResultDB();
    createCSV();
}


runReport();