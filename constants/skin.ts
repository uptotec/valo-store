type skin = {
  displayName: string;
  displayIcon: string;
  uuid: string;
  price?: number;
  levels:
    | null
    | {
        displayName: string;
        displayIcon: string;
        uuid: string;
      }[];
};

export default skin;
