import { Api as FigmaAPI, Node } from 'figma-api'

export const listStyles = async (token: string, fileId: string) => {
  try {
    const api = new FigmaAPI({
      personalAccessToken: token,
    })
    const styles =
      (await api.getFileStyles(fileId).then(data => data.meta?.styles)) || []
    const typographies = await getTypographies(
      api,
      fileId,
      styles.filter(style => style.style_type === 'TEXT').map(t => t.node_id),
    )
    const fills = await getFills(
      api,
      fileId,
      styles.filter(style => style.style_type === 'FILL').map(t => t.node_id),
    )
    return { typographies, fills }
  } catch (e) {
    return null;
  }
}

const getTypographies = async (
  api: InstanceType<typeof FigmaAPI>,
  fileId: string,
  nodeIds: string[],
) => {
  if (nodeIds.length === 0) return []
  return api.getFileNodes(fileId, nodeIds).then(file =>
    Object.entries(file.nodes)
      .map(node => [node[0], (node[1]?.document as unknown) as Node<'TEXT'>])
      .filter((node): node is [string, Node<'TEXT'>] => !!node[1])
      .map(mapTextNode)
      .sort((a,b) => a.styleName.localeCompare(b.styleName))
  )
}

const getFills = async (
  api: InstanceType<typeof FigmaAPI>,
  fileId: string,
  nodeIds: string[],
) => {
  if (nodeIds.length === 0) return []
  return api.getFileNodes(fileId, nodeIds).then(file =>
    Object.entries(file.nodes)
      .map(node => [
        node[0],
        (node[1]?.document as unknown) as Node<'RECTANGLE'>,
      ])
      .filter((node): node is [string, Node<'RECTANGLE'>] => !!node[1])
      .map(mapRectangleNodeToFill)
      .sort((a,b) => a.styleName.localeCompare(b.styleName))
  )
}

const mapTextNode = ([nodeId, node]: [string, Node<'TEXT'>]) => {
  return {
    nodeId,
    styleName: node.name,
    fontFamily: node.style.fontFamily,
    fontSize: `${node.style.fontSize / 10}rem`,
    fontWeight: node.style.fontWeight,
    letterSpacing: node.style.letterSpacing,
    lineHeight: Math.round(node.style.lineHeightPercentFontSize || 100) / 100,
  }
}

const mapRectangleNodeToFill = ([nodeId, node]: [
  string,
  Node<'RECTANGLE'>,
]) => {
  const codes = node.fills.map<[r: number, g: number, b: number]>(fill => {
    return [
      normalize(fill.color?.r),
      normalize(fill.color?.g),
      normalize(fill.color?.b)
    ]
  });
  return {
    nodeId,
    styleName: node.name,
    hex: rgbToHex(codes.length > 0 ? codes[0] : [0, 0, 0])
  }
}

const normalize = (n?: number) => {
  if (!n) return 0;
  return Math.round(n * 100 * 2.55);
}

const rgbToHex = (rgb: number[]) => {
  return (
    '#' +
    rgb.map(value => ('0' + value.toString(16)).slice(-2)).join('')
  )
}
