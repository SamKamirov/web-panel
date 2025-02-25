export const pushHistory = (data, title = "Title", url) => {
  history.pushState(data, title, url);
};
