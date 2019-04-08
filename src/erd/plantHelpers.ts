export const getPlantId = (node: any): string => {
    console.log(node);
    return node.aggregate ? node.aggregate + "." + node.id : node.id;
};
