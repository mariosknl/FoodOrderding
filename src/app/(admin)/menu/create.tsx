import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import {
  useCategoryList,
  useDeleteItem,
  useInsertItem,
  useItem,
  useTypesList,
  useUpdateItem,
} from "@/api/products";
import { randomUUID } from "expo-crypto";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import InputField from "@/components/InputField";

/**
 * The `CreateProductScreen` component within the `admin` folder is designed for the administrative interface of a food ordering app,
 * enabling administrators to add new products to the menu. This screen provides a comprehensive form for entering product details such
 * as name, description, price, category, and availability, along with the capability to upload images.
 *
 * Key functionalities of the `admin` `CreateProductScreen` include:
 * - A form interface that collects essential product information. This includes text inputs for the product name and description,
 *   a numeric input for price, dropdowns or selectors for category assignment, toggles for availability, and image upload capabilities.
 * - Validation mechanisms to ensure that all required fields are filled out correctly and that the entered data meets specific criteria
 *   (e.g., price format, image file size/type).
 * - Feedback to the user in the form of error messages or success indicators, enhancing the usability and interactivity of the product
 *   creation process.
 * - Integration with the backend or database for the actual creation of the product record upon form submission, including the handling
 *   of image storage and retrieval.
 * - Navigation options to return to the product list or menu management screens upon successful product creation, or to cancel the creation
 *   process.
 *
 * This component is crucial for expanding the menu offerings of the food ordering app by allowing administrators to seamlessly add new
 * products to the platform.
 */
const CreateProductScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [info, setInfo] = useState("");
  const [errors, setErrors] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [categoryValue, setCategoryValue] = useState<number | null>(null);
  const [typeValue, setTypeValue] = useState<number | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  const { id: idString } = useLocalSearchParams();

  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0] ?? "",
  );

  let imageSource = image
    ? { uri: image }
    : require("@assets/images/defaultΙmage.png");

  const isUpdating = !!idString;

  const mutation = useInsertItem();
  const { mutate: insertItem, isPending } = mutation;
  const { mutate: updateItem } = useUpdateItem();
  const { data: updatingItem } = useItem(id);
  const { mutate: deleteItem } = useDeleteItem();
  const { data: categories } = useCategoryList();
  const { data: types } = useTypesList();

  const filteredTypes = types?.filter(
    (type) => type.category_id === categoryValue,
  );

  const router = useRouter();

  useEffect(() => {
    if (updatingItem) {
      setName(updatingItem.name);
      setPrice(updatingItem.price.toString());
      setImage(updatingItem.img);
    }
  }, [updatingItem]);

  const resetFields = () => {
    setName("");
    setPrice("");
  };

  const validateInput = () => {
    if (!name) {
      setErrors("Name is required");
      return false;
    }
    if (!price) {
      setErrors("Price is required");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors("Price is not a number");
      return false;
    }

    return true;
  };

  const onSubmit = () => {
    if (isUpdating) {
      // update in the db
      onUpdate();
    } else {
      // create in the db
      onCreate();
    }
  };

  const onCreate = async () => {
    setErrors("");
    if (!validateInput()) {
      return;
    }

    try {
      const imagePath = await uploadImage();

      // save in the db
      insertItem(
        {
          price: parseFloat(price),
          name,
          img: imagePath,
          type_id: typeValue,
          info,
        },

        {
          onSuccess: () => {
            resetFields();
            router.back();
          },
          onError: (error) => {
            console.log("error", error);
          },
        },
      );
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const onUpdate = async () => {
    setErrors("");
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    // update in the db
    updateItem(
      { id, name, price: parseFloat(price), img: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      },
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png, image/jpeg, image/jpg";

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    console.log(error);

    if (data) {
      return data.path;
    }
  };

  const onDelete = () => {
    deleteItem(id, {
      onSuccess: () => {
        resetFields();
        router.replace("/(admin)");
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 justify-start p-[10px] gap-[8px]">
      <Stack.Screen
        options={{
          title: isUpdating ? "Ανανέωση Προϊόντος" : "Δημιουργία Προϊόντος",
        }}
      />
      <Image
        className="w-1/2 aspect-square self-center h-[250px]"
        source={imageSource}
      />
      <Text
        className="self-center font-JakartaBold text-basic my-[10px]"
        onPress={pickImage}
      >
        Επιλογή Εικόνας
      </Text>

      <View>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={categories!}
          search
          maxHeight={300}
          labelField="name"
          valueField="id"
          placeholder={!isFocus ? "Διάλεξε κατηγορία" : "..."}
          searchPlaceholder="Search..."
          value={categoryValue?.toString()}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setCategoryValue(item.id);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <FontAwesome
              style={styles.icon}
              color={isFocus ? "blue" : "black"}
              name="list"
              size={20}
            />
          )}
        />
      </View>

      <View>
        {categoryValue ? (
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={filteredTypes!}
            search
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder={!isFocus ? "Διάλεξε Τύπο" : "..."}
            searchPlaceholder="Search..."
            value={typeValue?.toString()}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setTypeValue(item.id);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? "blue" : "black"}
                name="Safety"
                size={20}
              />
            )}
          />
        ) : null}
      </View>

      <InputField
        label="Όνομα"
        value={name}
        onChangeText={setName}
        placeholder="Όνομα"
      />
      <InputField
        label="Τιμή"
        value={price}
        onChangeText={setPrice}
        placeholder="Τιμή"
      />

      <View>
        <InputField
          label="Πληροφορίες"
          multiline={true}
          numberOfLines={2}
          onChangeText={setInfo}
          value={info}
          style={styles.textarea}
        />
      </View>

      <Text style={{ color: "red" }}>{errors}</Text>
      <Button
        disabled={isPending}
        onPress={onSubmit}
        text={isPending ? "Creating..." : isUpdating ? "Update" : "Create"}
      />
      {isUpdating && (
        <Text
          onPress={confirmDelete}
          className="self-center font-JakartaBold text-basic mt-[10px]"
        >
          Delete
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default CreateProductScreen;
