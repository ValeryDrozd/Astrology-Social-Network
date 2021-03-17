export default interface GoogleProfile {
  name: {
    givenName: string;
    familyName: string;
  };
  emails: { value: string }[];
  photos: { value: string }[];
}
