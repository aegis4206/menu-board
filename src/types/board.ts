export const authUser = {
  id: "使用者代號",
  username: "使用者名稱",
  password: "使用者密碼",
  name: "使用者全名",
  email: "使用者信箱",
  phone: "使用者手機號碼",
};

export interface AuthUserType {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
}

export const posts = {
  // id: "編號",
  sort: "排序",
  title: "標題",
  // content: "內容",
  type_id: "分類名稱",
  tab_id: "分頁名稱",
  imgurl: "圖片位置",
  created_at: "建立時間",
  updated_at: "更新時間",
};
export interface PostsType {
  id: string;
  sort: string;
  title: string;
  content: string;
  type_id: string;
  tab_id: string;
  imgurl: string;
  created_at: string;
  updated_at: string;
}

export const types = {
  id: "編號",
  sort: "排序",
  name: "分類名稱",
  imgurl: "圖片位置",
  created_at: "建立時間",
  updated_at: "更新時間",
};
export interface TypesType {
  id: string;
  sort: string;
  name: string;
  imgurl: string;
  created_at: string;
  updated_at: string;
}

export const tabs = {
  id: "編號",
  sort: "排序",
  name: "分頁名稱",
  type_id: "分類名稱",
  created_at: "建立時間",
  updated_at: "更新時間",
};
export interface TabsType {
  id: string;
  sort: string;
  name: string;
  type_id: string;
  created_at: string;
  updated_at: string;
}
