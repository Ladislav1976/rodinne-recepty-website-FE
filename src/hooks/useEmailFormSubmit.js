export default function useEmailFormSubmit(dataName, dataSteps, dataIngredients, dataUrls) {
    let textingre = '';
    let textstep = '';
    let texturls = '';

    const name = `Nazov: \n${dataName}`;

    const ingredient =
        dataIngredients?.length > 0
            ? `Suroviny: \n${textingre.concat(
                  dataIngredients.map((group, index) => {
                      return `${group.groupName}\n${(group.ingredients
                          ? group.ingredients
                          : []
                      ).map((res) => {
                          return `${index + 1}. ${res.quantity} ${res.unit.unit}  ${
                              res.ingredient.ingredient
                          }\n\n`;
                      })}`;
                  })
              )}`
            : '';

    const steps =
        dataSteps.length > 0
            ? `Postup: \n${textstep.concat(
                  dataSteps.map((res, index) => `${index + 1}. ${res.step}\n`)
              )}`
            : '';
    const urlsTemp =
        dataUrls.length > 0
            ? texturls.concat(dataUrls.map((res, index) => `${index + 1}. ${res.url}\n`))
            : '';
    let urls = '';
    if (urlsTemp) {
        urls = `URL: \n${urlsTemp}`;
    }

    const res = `RECEPT: \n\n${name}\n\n${ingredient}\n\n${steps}\n\n${urls}`.split(',').join('');
    return res;
}
