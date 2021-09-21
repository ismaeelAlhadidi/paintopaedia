let globalTemplateId = 0;
function* generateTemplateId() {
    while(true) {
        globalTemplateId++;
        yield globalTemplateId;
    }
};
export let generatorTemplateId = generateTemplateId(); 