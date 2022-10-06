import { FontAwesome } from '@expo/vector-icons';
import { ListItem } from '@rneui/base';
import { Image, ImageSourcePropType } from 'react-native';
import Colors from '../constants/Colors';

const ProfileItem = ({
  iconName,
  image,
  title,
  value,
}: {
  iconName: any | null;
  image: ImageSourcePropType | null;
  title: string;
  value: string | number;
}) => {
  return (
    <ListItem
      containerStyle={{
        backgroundColor: Colors.dark.background,
        width: '100%',
      }}
    >
      {iconName && <FontAwesome name={iconName} size={28} color="gray" />}
      {image && (
        <Image
          source={image}
          style={{
            width: 24,
            height: 24,
          }}
        />
      )}
      <ListItem.Content>
        <ListItem.Title
          style={{ fontWeight: 'bold', color: 'white', fontSize: 14 }}
        >
          {title}
        </ListItem.Title>
        <ListItem.Subtitle style={{ color: '#ccc' }}>{value}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default ProfileItem;
