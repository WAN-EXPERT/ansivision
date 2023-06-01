const formatCron = (extract_periode : string) :string => {
    var splitted = extract_periode.split(' ');
    const tableauFiltrer = splitted.filter(word => word !=="?");
    console.log(tableauFiltrer);
    var nouvelle_periode = tableauFiltrer[0]+' '+tableauFiltrer[1]+' '+tableauFiltrer[2]+' '+tableauFiltrer[3]+' '+tableauFiltrer[4]+' '+tableauFiltrer[5];
    console.log(nouvelle_periode)
    return nouvelle_periode

}
export default formatCron;