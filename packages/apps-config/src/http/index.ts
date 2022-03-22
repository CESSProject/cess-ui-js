let httpUrl:string;
let linkUrl: string;
if(process.env.NODE_ENV === "production"){
  httpUrl = 'http://47.243.131.57:4399';
  linkUrl = 'http://data.cesslab.co.uk/data'
  // linkUrl = 'http://121.46.19.38:54558'
} else {
  httpUrl = 'http://47.243.131.57:4399';
  linkUrl = 'http://121.46.19.38:54558'
}

export {
  httpUrl,
  linkUrl
}
