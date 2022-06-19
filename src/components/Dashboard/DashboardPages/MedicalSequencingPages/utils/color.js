function colorNodes(d) {
    let color;
    switch (d.name) {
      case "Energía":
        color = "#E52620";
        break;
      case "IPPU":
        color = "#4771B6";
        break;
      case "AFOLU":
        color = "#71AE48";
        break;
      case "Desechos":
        color = "#FCC00E";
        break;
      case "CO2":
        color = "#AD4582";
        break;
      case "CH4":
        color = "#EF7E32";
        break;
      case "N2O":
        color = "#6296A7";
        break;
      case "HFC+SF6":
        color = "#FCC00E";
        break;
      default:
        color = "#DADADA";
    }
    return color;
  }
function colorLinks(d) {
  let color;
  switch (true) {
    case d.source.name === "Energía":
      color = "#E52620";
      break;
    case d.source.name === "IPPU":
      color = "#4771B6";
      break;
    case d.source.name === "AFOLU":
      color = "#71AE48";
      break;
    case d.source.name === "Desechos":
      color = "#FCC00E";
      break;
    case d.target.name === "CO2":
      color = "#AD4582";
      break;
    case d.target.name === "CH4":
      color = "#EF7E32";
      break;
    case d.target.name === "N2O":
      color = "#6296A7";
      break;
    case d.target.name === "HFC+SF6":
      color = "#FCC00E";
      break;
    default:
      color = "#DADADA";
  }

  return color;
}
export { colorNodes, colorLinks };
