const groupBy = function (arr, criteria) {
    return arr.reduce(function (obj, item) {
      var key = typeof criteria === "function" ? criteria(item) : item[criteria];
      if (!obj.hasOwnProperty(key)) {
        obj[key] = [];
      }
      obj[key].push(item);
      return obj;
    }, {});
  };
  
  const sumBy = (arr, iteratee) => {
    const func =
      typeof iteratee === "function" ? iteratee : (item) => item[iteratee];
    return arr.reduce((acc, item) => acc + func(item), 0);
  };
  
  function findMinMax(arr, param) {
    let min = arr[0][param],
      max = arr[0][param];
  
    for (let i = 1, len = arr.length; i < len; i++) {
      let v = arr[i][param];
      min = v < min ? v : min;
      max = v > max ? v : max;
    }
  
    return [min, max];
  }
  
  const filterData = (
    data,
    selectedAttr,
    prop1,
    prop2,
    selectedProp2,
    prop3,
    selectedProp3
  ) => {
    let data_lvl_1 = selectedProp2
        ? data.filter((elem) => elem[prop2] === selectedProp2)
        : data,
      data_lvl_2 = selectedProp3
        ? data_lvl_1.filter((elem) => elem[prop3] === selectedProp3)
        : data_lvl_1,
      data_lvl_3 = groupBy(data_lvl_2, (elem) => elem[prop1]),
      data_lvl_4 = Object.keys(data_lvl_3).map((key) => ({
        Category: key,
        Variable: sumBy(data_lvl_3[key], selectedAttr)
      }));
    return data_lvl_4;
  };
  
  function dataWaterFall(data, datos) {
    for (var i = 0; i < data.length; i++) {
      let end = data[i].Variable,
        start = i === 0 || i === data.length - 1 ? 0 : data[i - 1].Variable;
      datos.push({
        Category: data[i].Category,
        y: Math.max(start, end),
        height: Math.abs(end - start)
      });
    }
  }
  
  function dataToSankey(data, year, attr) {
    const databyYear = data.filter(
      (d) =>
        d["Sector"] !== "Partidas Informativas" &&
        d["Gas"] !== "PFCS" &&
        d["Gas"] !== "NMVOCs" &&
        d["Gas"] !== "NOx" &&
        d["Gas"] !== "SO2" &&
        d["Gas"] !== "CO" &&
        d["Em/Rem"] !== "Remoción" &&
        d["Year"] === year
    );
    const nodes = [];
    const props = ["Sector", "Subcategoría", "Gas"];
    const total = sumBy(databyYear, attr);
  
    for (const prop of props) {
      let node = groupBy(databyYear, (elem) => elem[prop]);
  
      node = Object.keys(node).map((key) => ({
        name: key,
        valor: sumBy(node[key], attr)
      }));
      node.sort((a, b) => (b.valor > a.valor ? 1 : -1));
      node.forEach((element) => {
        nodes.push({
          name: element.name,
          percent: (element.valor / total) * 100
        });
      });
    }
  
    let link1 = [];
    let link0 = groupBy(databyYear, (elem) => elem["Sector"]);
    // const mySet = new Set(databyYear.map((e) => e["Sector"]));
    // console.log(mySet);
  
    let link01 = Object.keys(link0).map((key) =>
      Object.keys(groupBy(link0[key], (elem) => elem["Subcategoría"])).map(
        (key2) => ({
          prop0: key,
          prop1: key2,
          prop2: sumBy(
            groupBy(link0[key], (elem) => elem["Subcategoría"])[key2],
            attr
          )
        })
      )
    );
  
    for (const a in link01) {
      for (const i in link01[a]) {
        link1.push({
          source: nodes.findIndex((e) => e.name === link01[a][i].prop0),
          target: nodes.findIndex((e) => e.name === link01[a][i].prop1),
          value: link01[a][i].prop2
        });
      }
    }
  
    let link2 = databyYear.map((elem) => ({
      source: nodes.findIndex((e) => e.name === elem["Subcategoría"]),
      target: nodes.findIndex((e) => e.name === elem["Gas"]),
      value: elem[attr]
    }));
  
    let datos = { nodes: nodes, links: link1.concat(link2) };
    console.log("sankey", datos);
    return datos;
  }
  
  export { filterData, findMinMax, dataWaterFall, dataToSankey };
  