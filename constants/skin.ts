type skin = {
  displayName: string;
  displayIcon: string;
  uuid: string;
  levels:
    | null
    | {
        displayName: string;
        displayIcon: string;
        uuid: string;
      }[];
};

export default skin;
