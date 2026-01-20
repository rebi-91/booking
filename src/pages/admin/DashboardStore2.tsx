import React, {
  useState,
  useEffect,
  useRef,
  CSSProperties,
  ReactNode,
  DragEvent,
  FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";

/** ------------------------------------------------------------------
 *  AlertModal (with optional children)
 *  ------------------------------------------------------------------ */
interface AlertModalProps {
  message: string;
  onClose: () => void;
  children?: ReactNode;
}

function AlertModal({ message, onClose, children }: AlertModalProps) {
  const overlayStyles: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };
  const modalStyles: React.CSSProperties = {
    backgroundColor: "#2a2a2a",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "450px",
    width: "90%",
    color: "#fff",
    position: "relative",
  };
  const closeButtonStyles: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#555",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    fontWeight: "bold",
  };
  const defaultCloseButton: React.CSSProperties = {
    marginTop: "20px",
    backgroundColor: "#3ecf8e",
    color: "#000",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  };

  return (
    <div style={overlayStyles}>
      <div style={modalStyles}>
        <button onClick={onClose} style={closeButtonStyles}>
          X
        </button>
        <p style={{ marginBottom: "20px" }}>{message}</p>
        {children}
        <button onClick={onClose} style={defaultCloseButton}>
          Close
        </button>
      </div>
    </div>
  );
}

/** 
 * The `products` table structure:
 *  - id: string
 *  - productName: string
 *  - brand: string | null
 *  - cat: string | null
 *  - information: string
 *  - productImage: string
 *  - productImage2: string | null
 *  - productImage3: string | null
 *  - productImage4: string | null
 *  - productImage5: string | null
 *  - formulation: string | null
 *  - size: string | null
 *  - price: string | null
 */
interface Product {
  id: string;
  productName: string;
  brand: string | null;
  cat: string | null;
  information: string;
  productImage: string;
  productImage2: string | null;
  productImage3: string | null;
  productImage4: string | null;
  productImage5: string | null;
  formulation: string | null;
  size: string | null;
  price: string | null;
}

/** 
 * The `formulation` table structure:
 *  - id: string
 *  - formName: string
 */
interface FormulationOption {
  id: string;
  formName: string;
}

/** 
 * The `category` table structure:
 *  - id: string
 *  - category: string
 */
interface CategoryData {
  id: string;
  category: string;
}

function Dashboardstore2() {
  const navigate = useNavigate();

  // Products & Formulations
  const [products, setProducts] = useState<Product[]>([]);
  const [allFormulations, setAllFormulations] = useState<FormulationOption[]>([]);

  // For the category dropdown in search
  const [allCategories, setAllCategories] = useState<CategoryData[]>([]);

  // Editing logic
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Product } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // Alert messages
  const [alertMessage, setAlertMessage] = useState<string>("");

  // Add Product form
  const [newProductName, setNewProductName] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newCat, setNewCat] = useState("");
  const [newInformation, setNewInformation] = useState("");
  const [newFormulation, setNewFormulation] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newProductImageUrl, setNewProductImageUrl] = useState("");

  // Search: productName/brand and category text
  const [searchProductName, setSearchProductName] = useState("");
  const [searchCategoryText, setSearchCategoryText] = useState("");
  // Also a category dropdown in search
  const [searchCategoryDropdown, setSearchCategoryDropdown] = useState("");

  // For long press
  const longPressRef = useRef<number | null>(null);

  // Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalImageURL, setModalImageURL] = useState<string>("");

  // For image drag styling
  const [draggingProductId, setDraggingProductId] = useState<string | null>(null);
  const [draggingImageField, setDraggingImageField] = useState<string | null>(null);

  // Selection
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

  // Column ordering state
  const [columnOrder, setColumnOrder] = useState<string[]>([
    "checkbox",
    "image1",
    "productName",
    "brand",
    "image2",
    "image3",
    "image4",
    "image5",
    "formulation",
    "size",
    "price"
  ]);

  // Dragging state for column reordering
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  /** ------------------------------------------------------------------
   *  1. On mount, fetch data WITHOUT ADMIN check
   *  ------------------------------------------------------------------ */
  useEffect(() => {
    fetchAllFormulations();
    fetchAllCategories();
    fetchAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllFormulations = async () => {
    try {
      console.log("Fetching formulations from database...");
      const { data, error } = await supabase
        .from("formulation")
        .select("*")
        .order("formName", { ascending: true });
      if (error) throw error;
      console.log("Formulations fetched:", data);
      if (data) setAllFormulations(data as FormulationOption[]);
    } catch (error: any) {
      console.error("Error fetching formulations:", error.message);
      // If table doesn't exist, create it with default values
      await createFormulationTable();
    }
  };

  const createFormulationTable = async () => {
    try {
      console.log("Creating formulation table...");
      // Create table if it doesn't exist
      const { error: createError } = await supabase.rpc('create_formulation_table_if_not_exists');
      
      if (createError) {
        console.log("RPC failed, trying direct SQL...");
        // Fallback: insert default formulations if table exists
        const defaultFormulations = [
          "Tablet", "Capsule", "Liquid", "Cream", "Ointment",
          "Spray", "Drops", "Inhaler", "Gel", "Powder",
          "Syrup", "Suspension", "Lotion", "Patch", "Suppository"
        ];
        
        for (const formName of defaultFormulations) {
          const { error } = await supabase
            .from("formulation")
            .insert({ formName })
            .select();
          // Ignore errors (like duplicates or table doesn't exist)
        }
      }
      
      // Try fetching again
      fetchAllFormulations();
    } catch (err) {
      console.error("Failed to create formulation table:", err);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("category")
        .select("id, category")
        .order("category", { ascending: true });
      if (error) throw error;
      if (data) setAllCategories(data as CategoryData[]);
    } catch (error: any) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, productName, brand, cat, information, productImage, productImage2, productImage3, productImage4, productImage5, formulation, size, price"
        )
        .order("productName", { ascending: true });
      if (error) throw error;
      if (data) setProducts(data as Product[]);
    } catch (error: any) {
      console.error("Error fetching products:", error.message);
      setAlertMessage("Error fetching products. Please try again.");
    }
  };

  /** ------------------------------------------------------------------
   *  2. Group + Filter by search - OR LOGIC VERSION
   *  ------------------------------------------------------------------ */
  const groupedProducts: Record<string, Product[]> = {};

  // Start with all products
  let filtered = [...products];

  // Only apply filters if any filter is active
  const hasActiveFilters = searchProductName || searchCategoryText || searchCategoryDropdown;

  if (hasActiveFilters) {
    const lowerSearchProductName = searchProductName.toLowerCase();
    const lowerSearchCategoryText = searchCategoryText.toLowerCase();
    
    filtered = filtered.filter((p) => {
      // Check each filter condition
      const matchesProductName = searchProductName 
        ? (p.productName?.toLowerCase().includes(lowerSearchProductName) || 
           p.brand?.toLowerCase().includes(lowerSearchProductName))
        : false;
      
      const matchesCategoryText = searchCategoryText 
        ? (p.cat?.toLowerCase().includes(lowerSearchCategoryText) || false)
        : false;
      
      const matchesCategoryDropdown = searchCategoryDropdown 
        ? (p.cat === searchCategoryDropdown)
        : false;
      
      // Return true if product matches ANY active filter
      return matchesProductName || matchesCategoryText || matchesCategoryDropdown;
    });
  }

  // Group them by cat with null safety
  filtered.forEach((prod) => {
    const catKey = prod.cat || "No Category";
    if (!groupedProducts[catKey]) groupedProducts[catKey] = [];
    groupedProducts[catKey].push(prod);
  });

  /** ------------------------------------------------------------------
   *  3. Editing logic (long press)
   *  ------------------------------------------------------------------ */
  const handlePointerDown = (id: string, field: keyof Product, currentValue: string) => {
    longPressRef.current = window.setTimeout(() => {
      setEditingCell({ id, field });
      setEditValue(currentValue || "");
    }, 500);
  };

  const handlePointerUpOrLeave = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setEditValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleEditSubmit();
  };

  const handleEditSubmit = async () => {
    if (!editingCell) return;
    const { id, field } = editingCell;

    try {
      const { error } = await supabase
        .from("products")
        .update({ [field]: editValue || null })
        .eq("id", id);
      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: editValue || null } : p))
      );
    } catch (err: any) {
      console.error("Error updating product:", err.message);
      alert(err.message || "Error updating product. Please try again.");
    } finally {
      setEditingCell(null);
      setEditValue("");
    }
  };

  /** ------------------------------------------------------------------
   *  4. Add product + image
   *  ------------------------------------------------------------------ */
  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!newProductName.trim()) {
        setAlertMessage("Please provide a product name.");
        return;
      }
      const { error } = await supabase.from("products").insert([
        {
          productName: newProductName,
          brand: newBrand || null,
          cat: newCat || null,
          information: newInformation || "",
          formulation: newFormulation || null,
          size: newSize || null,
          price: newPrice || null,
          productImage: newProductImageUrl || "",
          productImage2: null,
          productImage3: null,
          productImage4: null,
          productImage5: null,
        },
      ]);
      if (error) throw error;

      setAlertMessage("New product added successfully!");
      // Reset
      setNewProductName("");
      setNewBrand("");
      setNewCat("");
      setNewInformation("");
      setNewFormulation("");
      setNewSize("");
      setNewPrice("");
      setNewProductImageUrl("");
      // Refresh
      fetchAllProducts();
    } catch (err: any) {
      console.error("Error adding product:", err.message);
      setAlertMessage(err.message || "Error adding product. Please try again.");
    }
  };

  // Drag Over / Drop for new product
  const handleAddProductDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleAddProductDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await doUploadFile(e.dataTransfer.files[0], "new", "productImage");
    }
  };

  // Generic upload method for "new", "modal", or "table"
  const doUploadFile = async (file: File, mode: "new" | "modal" | "table", imageField: string = "productImage", product?: Product) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("products").getPublicUrl(filePath);
      if (!data.publicUrl) throw new Error("Failed to get public URL.");

      if (mode === "new") {
        // Setting the newly dropped image for the new product
        if (imageField === "productImage") {
          setNewProductImageUrl(data.publicUrl);
        }
      } else if (mode === "modal") {
        // Updating an existing product in the modal
        if (!selectedProduct) return;
        // DB update
        await supabase
          .from("products")
          .update({ [imageField]: data.publicUrl })
          .eq("id", selectedProduct.id);
        // Local update
        setProducts((prev) =>
          prev.map((p) =>
            p.id === selectedProduct.id ? { ...p, [imageField]: data.publicUrl } : p
          )
        );
        if (imageField === "productImage") {
          setModalImageURL(data.publicUrl);
        }
      } else if (mode === "table") {
        if (!product) return;
        // DB update
        await supabase
          .from("products")
          .update({ [imageField]: data.publicUrl })
          .eq("id", product.id);
        // Local update
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, [imageField]: data.publicUrl } : p
          )
        );
      }
    } catch (error: any) {
      console.error("Error uploading image:", error.message);
      alert(error.message || "Error uploading image. Please try again.");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await doUploadFile(e.target.files[0], "new", "productImage");
    }
  };

  const handleCopy = () => {
    if (newProductImageUrl) {
      navigator.clipboard
        .writeText(newProductImageUrl)
        .then(() => alert("Image URL copied to clipboard!"))
        .catch(() => alert("Failed to copy URL. Please try again."));
    } else {
      alert("No URL to copy.");
    }
  };

  /** ------------------------------------------------------------------
   *  5. Delete selected
   *  ------------------------------------------------------------------ */
  const handleDeleteSelected = async () => {
    if (selectedProductIds.length === 0) return;
    if (!window.confirm("Are you sure you want to delete the selected products?")) return;

    try {
      const { error } = await supabase.from("products").delete().in("id", selectedProductIds);
      if (error) throw error;
      setSelectedProductIds([]);
      fetchAllProducts();
    } catch (error: any) {
      console.error("Error deleting selected products:", error.message);
      setAlertMessage(error.message || "Error deleting selected products.");
    }
  };

  /** ------------------------------------------------------------------
   *  5b. DUPLICATE SELECTED
   *  ------------------------------------------------------------------ */
  const handleDuplicateSelected = async () => {
    if (selectedProductIds.length === 0) return;

    try {
      // Gather selected products
      const toDuplicate = products.filter((p) => selectedProductIds.includes(p.id));
      
      // Get the highest ID from the database to generate new ones
      const { data: maxIdData, error: maxIdError } = await supabase
        .from("products")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);
        
      if (maxIdError) throw maxIdError;
      
      let nextId = 1;
      if (maxIdData && maxIdData[0] && maxIdData[0].id) {
        // Convert to number and increment
        const lastId = maxIdData[0].id;
        nextId = parseInt(lastId.toString()) + 1;
      }
      
      // Insert each as a new row with new ID
      const inserts = toDuplicate.map(prod => ({
        id: nextId++,
        productName: `${prod.productName}`,
        brand: prod.brand,
        cat: prod.cat,
        information: prod.information,
        productImage: prod.productImage,
        productImage2: prod.productImage2,
        productImage3: prod.productImage3,
        productImage4: prod.productImage4,
        productImage5: prod.productImage5,
        formulation: prod.formulation,
        size: prod.size,
        price: prod.price,
      }));
      
      const { error } = await supabase
        .from("products")
        .insert(inserts);
        
      if (error) throw error;
      
      alert("Products duplicated successfully!");
      // Refresh
      fetchAllProducts();
    } catch (err: any) {
      console.error("Error duplicating products:", err.message);
      alert(err.message || "Error duplicating products. Please try again.");
    }
  };

  /** ------------------------------------------------------------------
   *  6. Product Modal
   *  ------------------------------------------------------------------ */
  const handleProductNameClick = (product: Product) => {
    setSelectedProduct(product);
    setModalImageURL(product.productImage || "");
    setShowProductModal(true);
  };

  const handleModalImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProduct) return;
    if (e.target.files && e.target.files[0]) {
      await doUploadFile(e.target.files[0], "modal", "productImage");
    }
  };

  const handleModalDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleModalDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await doUploadFile(e.dataTransfer.files[0], "modal", "productImage");
    }
  };

  const handleModalFieldChange = (field: keyof Product, value: string) => {
    if (!selectedProduct) return;
    setSelectedProduct((prev) => (prev ? { ...prev, [field]: value || null } : null));
  };

  const handleModalSave = async () => {
    if (!selectedProduct) return;
    try {
      const { id, cat, productName, brand, information, formulation, size, price } = selectedProduct;
      const { error } = await supabase
        .from("products")
        .update({
          cat: cat || null,
          productName,
          brand,
          information,
          formulation: formulation || null,
          size: size || null,
          price: price || null,
          productImage: modalImageURL,
        })
        .eq("id", id);
      if (error) throw error;

      // Update local
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, cat, productName, brand, information, formulation, size, price, productImage: modalImageURL } : p
        )
      );
      setShowProductModal(false);
    } catch (err: any) {
      console.error("Error saving product changes:", err.message);
      alert(err.message || "Error saving product changes. Please try again.");
    }
  };

  /** ------------------------------------------------------------------
   *  7. Table image drag-n-drop
   *  ------------------------------------------------------------------ */
  function handleTableImageDragOver(e: DragEvent<HTMLDivElement>, productId: string, imageField: string) {
    e.preventDefault();
    setDraggingProductId(productId);
    setDraggingImageField(imageField);
  }
  
  function handleTableImageDragLeave() {
    setDraggingProductId(null);
    setDraggingImageField(null);
  }
  
  function handleTableImageDrop(e: DragEvent<HTMLDivElement>, product: Product, imageField: string) {
    e.preventDefault();
    setDraggingProductId(null);
    setDraggingImageField(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      doUploadFile(e.dataTransfer.files[0], "table", imageField, product);
    }
  }

  /** ------------------------------------------------------------------
   *  8. Export ALL data to CSV
   *  ------------------------------------------------------------------ */
  const handleExportAllToExcel = () => {
    const headers = [
      "id",
      "cat",
      "productName",
      "brand",
      "information",
      "productImage",
      "productImage2",
      "productImage3",
      "productImage4",
      "productImage5",
      "formulation",
      "size",
      "price",
    ];
    let csvContent = headers.join(",") + "\n";

    products.forEach((p) => {
      const row = [
        p.id,
        p.cat ?? "",
        p.productName,
        p.brand ?? "",
        p.information,
        p.productImage,
        p.productImage2 ?? "",
        p.productImage3 ?? "",
        p.productImage4 ?? "",
        p.productImage5 ?? "",
        p.formulation ?? "",
        p.size ?? "",
        p.price ?? "",
      ];
      // Escape quotes
      const escaped = row.map((val) => `"${val.replace(/"/g, '""')}"`);
      csvContent += escaped.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /** ------------------------------------------------------------------
   *  9. Selection logic
   *  ------------------------------------------------------------------ */
  const handleSelectRow = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  // The "Select All" for each table's header
  const handleSelectAll = () => {
    const allIds = Object.values(groupedProducts).flat().map((p) => p.id);
    // if they're all selected, unselect; else select them
    if (selectedProductIds.length === allIds.length && allIds.length > 0) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(allIds);
    }
  };

  useEffect(() => {
    // Check if all final filtered products are selected
    const allIds = Object.values(groupedProducts).flat().map((p) => p.id);
    if (allIds.length > 0 && allIds.every((id) => selectedProductIds.includes(id))) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [selectedProductIds, groupedProducts]);

  /** ------------------------------------------------------------------
   *  10. Styles
   *  ------------------------------------------------------------------ */
  const styles: Record<string, CSSProperties> = {
    container: {
      width: "95%",
      maxWidth: "1400px",
      margin: "20px auto",
      padding: "20px",
      backgroundColor: "#121212",
      boxShadow: "0 4px 20px 1px #007BA7",
      borderRadius: "10px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#ffffff",
    },
    headerContainer: {
      textAlign: "center",
      marginBottom: "30px",
    },
    headerTitle: {
      fontSize: "36px",
      fontWeight: "700",
      color: "#e0e0e0",
    },
    exportAllButton: {
      backgroundColor: "#3ecf8e",
      color: "#000",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      padding: "8px 16px",
      cursor: "pointer",
    },
    topSection: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "30px",
      flexWrap: "wrap",
      gap: "20px",
    },
    filterContainer: {
      backgroundColor: "#2a2a2a",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 12px 1px #000",
      flex: "1",
      minWidth: "280px",
      height: "360px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    addProductContainer: {
      backgroundColor: "#2a2a2a",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 12px 1px #000",
      flex: "1",
      minWidth: "280px",
    },
    input: {
      backgroundColor: "#555",
      marginBottom: "10px",
      color: "#fff",
      padding: "10px",
      fontSize: "17px",
      border: "1px solid #555",
      borderRadius: "5px",
      outline: "none",
      width: "100%",
    },
    input2: {
      backgroundColor: "#555",
      marginBottom: "10px",
      color: "#fff",
      padding: "10px",
      fontSize: "17px",
      border: "1px solid #555",
      borderRadius: "5px",
      outline: "none",
      width: "120%",
    },
    textarea: {
      backgroundColor: "#555",
      marginBottom: "10px",
      color: "#fff",
      padding: "10px",
      fontSize: "16px",
      border: "1px solid #555",
      borderRadius: "5px",
      outline: "none",
      width: "100%",
      height: "80px",
      resize: "vertical",
    },
    dropdown: {
      backgroundColor: "#555",
      color: "#fff",
      padding: "8px",
      fontSize: "16px",
      border: "1px solid #555",
      borderRadius: "5px",
      outline: "none",
      marginBottom: "10px",
      width: "100%",
    },
    dropdown2: {
      backgroundColor: "#555",
      color: "#fff",
      padding: "8px",
      fontSize: "20px",
      border: "1px solid #555",
      borderRadius: "5px",
      outline: "none",
      marginBottom: "10px",
      width: "100%",
    },
    submitButton: {
      backgroundColor: "#3ecf8e",
      color: "#000",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      padding: "10px 20px",
      cursor: "pointer",
      marginTop: "5px",
      width: "100%",
    },
    tableContainer: {
      overflowX: "auto",
      borderRadius: "10px",
      backgroundColor: "#1e1e1e",
      padding: "12px",
      marginTop: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      color: "#fff",
      fontSize: "16px",
      marginBottom: "20px",
    },
    th: {
      border: "1px solid #555",
      textAlign: "center",
      padding: "10px",
      backgroundColor: "#3ecf8e",
      color: "#000",
      fontSize: "18px",
      cursor: "grab",
      userSelect: "none",
    },
    draggingTh: {
      border: "1px solid #555",
      textAlign: "center",
      padding: "10px",
      backgroundColor: "#2a8a5c",
      color: "#000",
      fontSize: "18px",
      cursor: "grabbing",
      userSelect: "none",
    },
    td: {
      border: "1px solid #555",
      textAlign: "center",
      padding: "10px",
      color: "#fff",
      cursor: "pointer",
      position: "relative",
      verticalAlign: "middle",
      whiteSpace: "pre-wrap",
    },
    editInput: {
      backgroundColor: "#555",
      color: "#fff",
      border: "1px solid #555",
      borderRadius: "5px",
      padding: "5px",
      fontSize: "16px",
      outline: "none",
      width: "100%",
      textAlign: "left",
    },
    editSelect: {
      backgroundColor: "#555",
      color: "#fff",
      border: "1px solid #555",
      borderRadius: "5px",
      padding: "5px",
      fontSize: "16px",
      outline: "none",
      width: "100%",
      textAlign: "left",
    },
    tableImageContainer: {
      width: "60px",
      height: "60px",
      margin: "0 auto",
      position: "relative",
      borderRadius: "5px",
      overflow: "hidden",
    },
    tableImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    deleteButton: {
      backgroundColor: "red",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontSize: "14px",
      padding: "6px 12px",
      cursor: "pointer",
      marginRight: "8px",
      marginBottom: "5px",
      opacity: 0.4,
      transition: "opacity 0.2s ease",
    },
    activeDeleteButton: {
      backgroundColor: "red",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontSize: "14px",
      padding: "6px 12px",
      cursor: "pointer",
      marginRight: "8px",
      marginBottom: "5px",
      opacity: 1,
      transition: "opacity 0.2s ease",
    },
    inactiveDuplicateButton: {
      backgroundColor: "#ADD8E6",
      color: "#000",
      border: "none",
      borderRadius: "5px",
      fontSize: "14px",
      padding: "6px 12px",
      cursor: "pointer",
      marginRight: "728px",
      marginBottom: "5px",
      opacity: 0.4,
      transition: "opacity 0.2s ease",
    },
    activeDuplicateButton: {
      backgroundColor: "#ADD8E6",
      color: "#000",
      border: "none",
      borderRadius: "5px",
      fontSize: "14px",
      padding: "6px 12px",
      cursor: "pointer",
      marginRight: "728px",
      marginBottom: "5px",
      opacity: 1,
      transition: "opacity 0.2s ease",
    },
    checkbox: {
      width: "20px",
      height: "20px",
      cursor: "pointer",
    },
    alertMessage: {
      marginTop: "20px",
      padding: "10px",
      backgroundColor: "#ff4d4d",
      color: "#fff",
      borderRadius: "5px",
      textAlign: "center",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    modalContent: {
      backgroundColor: "#2a2a2a",
      padding: "20px",
      borderRadius: "10px",
      width: "90%",
      maxWidth: "500px",
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      backgroundColor: "#555",
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    modalImageContainer: {
      position: "relative",
      width: "100%",
      textAlign: "center",
      marginBottom: "20px",
    },
    modalImage: {
      maxWidth: "100%",
      maxHeight: "300px",
      borderRadius: "10px",
      objectFit: "cover",
    },
    penIconButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      backgroundColor: "#3f3f3f",
      border: "none",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "20px",
      color: "yellow",
    },
  };

  // Column configuration for rendering
  const columnConfig: Record<string, { label: string; width: string; field?: keyof Product }> = {
    checkbox: { label: "✓", width: "30px" },
    image1: { label: "Image 1", width: "80px", field: "productImage" },
    productName: { label: "Product Name", width: "20%", field: "productName" },
    brand: { label: "Brand", width: "15%", field: "brand" },
    image2: { label: "Image 2", width: "80px", field: "productImage2" },
    image3: { label: "Image 3", width: "80px", field: "productImage3" },
    image4: { label: "Image 4", width: "80px", field: "productImage4" },
    image5: { label: "Image 5", width: "80px", field: "productImage5" },
    formulation: { label: "Formulation", width: "15%", field: "formulation" },
    size: { label: "Size", width: "10%", field: "size" },
    price: { label: "Price", width: "10%", field: "price" },
  };

  return (
    <div style={{
      backgroundColor: '#000',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto', 
    }}>
      <div style={styles.container}>
        <div style={styles.headerContainer}>
          <h1 style={styles.headerTitle}>Dashboard2</h1>
          <p style={{ color: "#b0b0b0" }}>Product Management</p>
          <small style={{ color: "#888", fontSize: "12px" }}>
            Formulation dropdown shows {allFormulations.length} options from database
          </small>
        </div>

        {/* Top: Filter & Add Product */}
        <div style={styles.topSection}>
          {/* Search Container */}
          <div style={styles.filterContainer}>
            <h2 style={{ marginBottom: "10px", color: "#fff" }}>Search</h2>
            {/* Search by product name or brand - FIXED */}
            <input
              type="text"
              placeholder="Search product/brand..."
              value={searchProductName}
              onChange={(e) => setSearchProductName(e.target.value)}
              style={styles.input}
            />

            {/* Search by Category text */}
            <input
              type="text"
              placeholder="Search by Category text..."
              value={searchCategoryText}
              onChange={(e) => setSearchCategoryText(e.target.value)}
              style={styles.input}
            />

            {/* Category dropdown (all categories from supabase) */}
            <select
              style={styles.dropdown}
              value={searchCategoryDropdown}
              onChange={(e) => setSearchCategoryDropdown(e.target.value)}
            >
              <option value="">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          {/* Add Product Container */}
          <div
            style={styles.addProductContainer}
            onDragOver={handleAddProductDragOver}
            onDrop={handleAddProductDrop}
          >
            <h2 style={{ marginBottom: "10px", color: "#fff" }}>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              {/* Product Name */}
              <input
                type="text"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                style={styles.input}
                placeholder="Product Name"
                required
              />

              {/* Brand Name */}
              <input
                type="text"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                style={styles.input}
                placeholder="Brand Name"
              />

              {/* Category Dropdown */}
              <select
                style={styles.dropdown2}
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
              >
                <option value="">-- No Category --</option>
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>

              {/* Description (information) */}
              <textarea
                value={newInformation}
                onChange={(e) => setNewInformation(e.target.value)}
                style={styles.textarea}
                placeholder="Product description..."
              />

              {/* Formulation / Size row */}
              <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
                {/* Formulation (50%) - NOW FROM DATABASE */}
                <select
                  style={{ ...styles.dropdown, width: "50%", marginBottom: 0 }}
                  value={newFormulation}
                  onChange={(e) => setNewFormulation(e.target.value)}
                >
                  <option value="">-- Formulation ({allFormulations.length} options) --</option>
                  {allFormulations.map((f) => (
                    <option key={f.id} value={f.formName}>
                      {f.formName}
                    </option>
                  ))}
                </select>
                {/* Size (50%) */}
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  style={{ ...styles.input, width: "50%", marginBottom: 0 }}
                  placeholder="Size"
                />
              </div>

              {/* Price (100%) */}
              <input
                type="text"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                style={styles.input}
                placeholder="Price"
              />

              {/* File input (hidden) */}
              <input
                type="file"
                accept="image/*"
                id="product-image-input"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              {/* Row: URL, Copy, Upload icons */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <input
                  type="text"
                  value={newProductImageUrl}
                  readOnly
                  style={{ ...styles.input2, marginBottom: 0 }}
                  placeholder="Image URL will appear here..."
                />
                {/* Copy button with icon */}
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!newProductImageUrl}
                  style={{
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src="src/assets/copy.png"
                    alt="Copy URL"
                    style={{ width: "24px", height: "24px" }}
                  />
                </button>
                {/* Upload button with icon */}
                <button
                  type="button"
                  onClick={() => document.getElementById("product-image-input")?.click()}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "5px",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src="src/assets/upload.png"
                    alt="Upload"
                    style={{ width: "30px", height: "30px" }}
                  />
                </button>
              </div>

              {/* Preview image */}
              {newProductImageUrl && (
                <img src={newProductImageUrl} alt="Preview" style={{ width: "60px", height: "60px" }} />
              )}

              <button type="submit" style={styles.submitButton}>
                Add Product
              </button>
            </form>
          </div>
        </div>

        {/* Export ALL to Excel (CSV) */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-10px" }}>
          <button style={styles.exportAllButton} onClick={handleExportAllToExcel}>
            Export to Excel
          </button>
        </div>

        {/* Alert Modal */}
        {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />}

        {/*  Table(s) grouped by Category */}
        {Object.keys(groupedProducts).length === 0 ? (
          <p style={{ textAlign: "left", color: "#fff" }}>No products available.</p>
        ) : (
          Object.keys(groupedProducts).map((catName) => {
            const catProducts = groupedProducts[catName];

            return (
              <div key={catName} style={styles.tableContainer}>
                {/* Duplicate + Delete buttons (above each category header) */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <button
                    style={
                      selectedProductIds.length > 0
                        ? styles.activeDeleteButton
                        : styles.deleteButton
                    }
                    onClick={handleDeleteSelected}
                    disabled={selectedProductIds.length === 0}
                    aria-label="Delete Selected Products"
                  >
                    Delete Selected
                  </button>

                  <button
                    style={
                      selectedProductIds.length > 0
                        ? styles.activeDuplicateButton
                        : styles.inactiveDuplicateButton
                    }
                    onClick={handleDuplicateSelected}
                    disabled={selectedProductIds.length === 0}
                    aria-label="Duplicate Selected Products"
                  >
                    Duplicate
                  </button>
                </div>

                {/* Category Header (bold, left-aligned, white) */}
                <h2
                  style={{
                    marginBottom: "10px",
                    textAlign: "left",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {catName === "No Category" ? "Uncategorized" : catName}
                </h2>

                <table style={styles.table}>
                  <thead>
                    <tr>
                      {columnOrder.map((columnId) => {
                        const config = columnConfig[columnId];
                        
                        return (
                          <th
                            key={columnId}
                            style={{ ...(draggedColumn === columnId ? styles.draggingTh : styles.th), width: config.width }}
                            draggable
                            onDragStart={(e) => {
                              setDraggedColumn(columnId);
                              e.dataTransfer.setData("text/plain", columnId);
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              const targetColumnId = columnId;
                              if (draggedColumn && draggedColumn !== targetColumnId) {
                                const newOrder = [...columnOrder];
                                const draggedIndex = newOrder.indexOf(draggedColumn);
                                const targetIndex = newOrder.indexOf(targetColumnId);
                                newOrder.splice(draggedIndex, 1);
                                newOrder.splice(targetIndex, 0, draggedColumn);
                                setColumnOrder(newOrder);
                              }
                              setDraggedColumn(null);
                            }}
                            onDragEnd={() => setDraggedColumn(null)}
                          >
                            {config.label}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {catProducts.map((product) => {
                      const isDraggingOver = draggingProductId === product.id;

                      return (
                        <tr key={product.id}>
                          {columnOrder.map((columnId) => {
                            const config = columnConfig[columnId];
                            
                            // Checkbox column
                            if (columnId === "checkbox") {
                              return (
                                <td key="checkbox" style={styles.td}>
                                  <input
                                    type="checkbox"
                                    checked={selectedProductIds.includes(product.id)}
                                    onChange={() => handleSelectRow(product.id)}
                                    style={styles.checkbox}
                                  />
                                </td>
                              );
                            }

                            // Image columns (1-5)
                            if (columnId.startsWith("image")) {
                              const imageField = config.field as keyof Product;
                              const imageUrl = product[imageField] as string;
                              const isCurrentDragging = isDraggingOver && draggingImageField === imageField;

                              return (
                                <td
                                  key={columnId}
                                  style={styles.td}
                                  onDragOver={(e) => handleTableImageDragOver(e, product.id, imageField)}
                                  onDragLeave={handleTableImageDragLeave}
                                  onDrop={(e) => handleTableImageDrop(e, product, imageField)}
                                  onPointerDown={() =>
                                    handlePointerDown(product.id, imageField, imageUrl || "")
                                  }
                                  onPointerUp={handlePointerUpOrLeave}
                                  onPointerLeave={handlePointerUpOrLeave}
                                >
                                  {editingCell?.id === product.id && editingCell.field === imageField ? (
                                    <input
                                      type="text"
                                      value={editValue}
                                      onChange={handleEditChange}
                                      onBlur={handleEditSubmit}
                                      onKeyDown={handleKeyDown}
                                      autoFocus
                                      style={styles.editInput}
                                    />
                                  ) : (
                                    <div
                                      style={styles.tableImageContainer}
                                    >
                                      <img
                                        src={
                                          imageUrl ||
                                          "https://cdn-icons-png.flaticon.com/512/7936/7936338.png"
                                        }
                                        alt={`${product.productName} ${columnId}`}
                                        style={{
                                          ...styles.tableImage,
                                          opacity: isCurrentDragging ? 0.5 : 1,
                                        }}
                                      />
                                    </div>
                                  )}
                                </td>
                              );
                            }

                            // Text columns (productName, brand, formulation, size, price)
                            if (config.field && !columnId.startsWith("image")) {
                              const field = config.field as keyof Product;
                              const value = product[field] as string;

                              return (
                                <td
                                  key={columnId}
                                  style={styles.td}
                                  onClick={field === "productName" ? () => handleProductNameClick(product) : undefined}
                                  onPointerDown={() =>
                                    handlePointerDown(product.id, field, value || "")
                                  }
                                  onPointerUp={handlePointerUpOrLeave}
                                  onPointerLeave={handlePointerUpOrLeave}
                                >
                                  {editingCell?.id === product.id && editingCell.field === field ? (
                                    field === "formulation" ? (
                                      <select
                                        value={editValue}
                                        onChange={handleEditChange}
                                        onBlur={handleEditSubmit}
                                        onKeyDown={handleKeyDown}
                                        autoFocus
                                        style={styles.editSelect}
                                      >
                                        <option value="">-- Select Formulation --</option>
                                        {allFormulations.map((f) => (
                                          <option key={f.id} value={f.formName}>
                                            {f.formName}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <input
                                        type="text"
                                        value={editValue}
                                        onChange={handleEditChange}
                                        onBlur={handleEditSubmit}
                                        onKeyDown={handleKeyDown}
                                        autoFocus
                                        style={styles.editInput}
                                      />
                                    )
                                  ) : field === "productName" ? (
                                    <span style={{ color: "#3ecf8e", textDecoration: "underline", cursor: "pointer" }}>
                                      {value || ""}
                                    </span>
                                  ) : (
                                    value || ""
                                  )}
                                </td>
                              );
                            }

                            return null;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })
        )}

        {/* Product Modal */}
        {showProductModal && selectedProduct && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <button
                style={styles.closeButton}
                onClick={() => setShowProductModal(false)}
              >
                X
              </button>

              {/* Category Dropdown at top */}
              <div style={{ marginBottom: "20px" }}>
                <select
                  style={styles.dropdown}
                  value={selectedProduct.cat || ""}
                  onChange={(e) => handleModalFieldChange("cat", e.target.value)}
                >
                  <option value="">-- No Category --</option>
                  {allCategories.map((cat) => (
                    <option key={cat.id} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image with pen icon to upload a new one, plus drag-and-drop */}
              <div
                style={styles.modalImageContainer}
                onDragOver={handleModalDragOver}
                onDrop={handleModalDrop}
              >
                <img
                  src={
                    modalImageURL ||
                    "https://cdn-icons-png.flaticon.com/512/7936/7936338.png"
                  }
                  alt="Product"
                  style={styles.modalImage}
                />
                <button
                  style={styles.penIconButton}
                  onClick={() => {
                    const input = document.getElementById("modal-file-input");
                    if (input) input.click();
                  }}
                >
                  ✏️
                </button>
                <input
                  type="file"
                  accept="image/*"
                  id="modal-file-input"
                  style={{ display: "none" }}
                  onChange={handleModalImageChange}
                />
              </div>

              {/* Product Name */}
              <input
                type="text"
                value={selectedProduct.productName}
                onChange={(e) => handleModalFieldChange("productName", e.target.value)}
                style={styles.input}
              />

              {/* Brand */}
              <input
                type="text"
                value={selectedProduct.brand || ""}
                onChange={(e) => handleModalFieldChange("brand", e.target.value)}
                style={styles.input}
                placeholder="Brand"
              />

              {/* Price */}
              <input
                type="text"
                value={selectedProduct.price || ""}
                onChange={(e) => handleModalFieldChange("price", e.target.value)}
                style={styles.input}
                placeholder="Price"
              />

              {/* Formulation DROPDOWN - ADDED TO MODAL */}
              <div style={{ marginBottom: "20px" }}>
                <select
                  style={styles.dropdown}
                  value={selectedProduct.formulation || ""}
                  onChange={(e) => handleModalFieldChange("formulation", e.target.value)}
                >
                  <option value="">-- Select Formulation --</option>
                  {allFormulations.map((f) => (
                    <option key={f.id} value={f.formName}>
                      {f.formName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size */}
              <input
                type="text"
                value={selectedProduct.size || ""}
                onChange={(e) => handleModalFieldChange("size", e.target.value)}
                style={styles.input}
                placeholder="Size"
              />

              {/* Description (information) */}
              <textarea
                value={selectedProduct.information}
                onChange={(e) => handleModalFieldChange("information", e.target.value)}
                style={styles.textarea}
              />

              <button
                style={{ ...styles.submitButton, marginTop: "10px" }}
                onClick={handleModalSave}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboardstore2;
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   CSSProperties,
//   ReactNode,
//   DragEvent,
//   FormEvent,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";

// /** ------------------------------------------------------------------
//  *  AlertModal (with optional children)
//  *  ------------------------------------------------------------------ */
// interface AlertModalProps {
//   message: string;
//   onClose: () => void;
//   children?: ReactNode;
// }

// function AlertModal({ message, onClose, children }: AlertModalProps) {
//   const overlayStyles: React.CSSProperties = {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 9999,
//   };
//   const modalStyles: React.CSSProperties = {
//     backgroundColor: "#2a2a2a",
//     padding: "20px",
//     borderRadius: "10px",
//     maxWidth: "450px",
//     width: "90%",
//     color: "#fff",
//     position: "relative",
//   };
//   const closeButtonStyles: React.CSSProperties = {
//     position: "absolute",
//     top: "10px",
//     right: "10px",
//     backgroundColor: "#555",
//     color: "#fff",
//     border: "none",
//     borderRadius: "50%",
//     width: "30px",
//     height: "30px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   };
//   const defaultCloseButton: React.CSSProperties = {
//     marginTop: "20px",
//     backgroundColor: "#3ecf8e",
//     color: "#000",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "16px",
//     cursor: "pointer",
//   };

//   return (
//     <div style={overlayStyles}>
//       <div style={modalStyles}>
//         <button onClick={onClose} style={closeButtonStyles}>
//           X
//         </button>
//         <p style={{ marginBottom: "20px" }}>{message}</p>
//         {children}
//         <button onClick={onClose} style={defaultCloseButton}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }

// /** 
//  * The `products` table structure:
//  *  - id: string
//  *  - productName: string
//  *  - brand: string | null
//  *  - cat: string | null
//  *  - information: string
//  *  - productImage: string
//  *  - strength: string | null
//  *  - formulation: string | null
//  *  - size: string | null
//  *  - price: string | null
//  */
// interface Product {
//   id: string;
//   productName: string;
//   brand: string | null;
//   cat: string | null;
//   information: string;
//   productImage: string;
//   strength: string | null;
//   formulation: string | null;
//   size: string | null;
//   price: string | null;
// }

// /** 
//  * The `formulation` table structure:
//  *  - id: string
//  *  - formName: string
//  */
// interface FormulationOption {
//   id: string;
//   formName: string;
// }

// /** 
//  * The `category` table structure:
//  *  - id: string
//  *  - category: string
//  */
// interface CategoryData {
//   id: string;
//   category: string;
// }

// function Dashboardstore2() {
//   const navigate = useNavigate();

//   // Products & Formulations
//   const [products, setProducts] = useState<Product[]>([]);
//   const [allFormulations, setAllFormulations] = useState<FormulationOption[]>([]);

//   // For the category dropdown in search
//   const [allCategories, setAllCategories] = useState<CategoryData[]>([]);

//   // Editing logic
//   const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Product } | null>(null);
//   const [editValue, setEditValue] = useState<string>("");

//   // Alert messages
//   const [alertMessage, setAlertMessage] = useState<string>("");

//   // Add Product form
//   const [newProductName, setNewProductName] = useState("");
//   const [newBrand, setNewBrand] = useState("");
//   const [newCat, setNewCat] = useState("");
//   const [newInformation, setNewInformation] = useState("");
//   const [newStrength, setNewStrength] = useState("");
//   const [newFormulation, setNewFormulation] = useState("");
//   const [newSize, setNewSize] = useState("");
//   const [newPrice, setNewPrice] = useState("");
//   const [newProductImageUrl, setNewProductImageUrl] = useState("");

//   // Search: productName/brand and category text
//   const [searchProductName, setSearchProductName] = useState("");
//   const [searchCategoryText, setSearchCategoryText] = useState("");
//   // Also a category dropdown in search
//   const [searchCategoryDropdown, setSearchCategoryDropdown] = useState("");

//   // For long press
//   const longPressRef = useRef<number | null>(null);

//   // Modal
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [modalImageURL, setModalImageURL] = useState<string>("");

//   // For image drag styling
//   const [draggingProductId, setDraggingProductId] = useState<string | null>(null);

//   // Selection
//   const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
//   const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

//   /** ------------------------------------------------------------------
//    *  1. On mount, fetch data WITHOUT ADMIN check
//    *  ------------------------------------------------------------------ */
//   useEffect(() => {
//     fetchAllFormulations();
//     fetchAllCategories();
//     fetchAllProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchAllFormulations = async () => {
//     try {
//       console.log("Fetching formulations from database...");
//       const { data, error } = await supabase
//         .from("formulation")
//         .select("*")
//         .order("formName", { ascending: true });
//       if (error) throw error;
//       console.log("Formulations fetched:", data);
//       if (data) setAllFormulations(data as FormulationOption[]);
//     } catch (error: any) {
//       console.error("Error fetching formulations:", error.message);
//       // If table doesn't exist, create it with default values
//       await createFormulationTable();
//     }
//   };

//   const createFormulationTable = async () => {
//     try {
//       console.log("Creating formulation table...");
//       // Create table if it doesn't exist
//       const { error: createError } = await supabase.rpc('create_formulation_table_if_not_exists');
      
//       if (createError) {
//         console.log("RPC failed, trying direct SQL...");
//         // Fallback: insert default formulations if table exists
//         const defaultFormulations = [
//           "Tablet", "Capsule", "Liquid", "Cream", "Ointment",
//           "Spray", "Drops", "Inhaler", "Gel", "Powder",
//           "Syrup", "Suspension", "Lotion", "Patch", "Suppository"
//         ];
        
//         for (const formName of defaultFormulations) {
//           const { error } = await supabase
//             .from("formulation")
//             .insert({ formName })
//             .select();
//           // Ignore errors (like duplicates or table doesn't exist)
//         }
//       }
      
//       // Try fetching again
//       fetchAllFormulations();
//     } catch (err) {
//       console.error("Failed to create formulation table:", err);
//     }
//   };

//   const fetchAllCategories = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("category")
//         .select("id, category")
//         .order("category", { ascending: true });
//       if (error) throw error;
//       if (data) setAllCategories(data as CategoryData[]);
//     } catch (error: any) {
//       console.error("Error fetching categories:", error.message);
//     }
//   };

//   const fetchAllProducts = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("products")
//         .select(
//           "id, productName, brand, cat, information, productImage, strength, formulation, size, price"
//         )
//         .order("productName", { ascending: true });
//       if (error) throw error;
//       if (data) setProducts(data as Product[]);
//     } catch (error: any) {
//       console.error("Error fetching products:", error.message);
//       setAlertMessage("Error fetching products. Please try again.");
//     }
//   };

//   /** ------------------------------------------------------------------
//  *  2. Group + Filter by search - OR LOGIC VERSION
//  *  ------------------------------------------------------------------ */
// const groupedProducts: Record<string, Product[]> = {};

// // Start with all products
// let filtered = [...products];

// // Only apply filters if any filter is active
// const hasActiveFilters = searchProductName || searchCategoryText || searchCategoryDropdown;

// if (hasActiveFilters) {
//   const lowerSearchProductName = searchProductName.toLowerCase();
//   const lowerSearchCategoryText = searchCategoryText.toLowerCase();
  
//   filtered = filtered.filter((p) => {
//     // Check each filter condition
//     const matchesProductName = searchProductName 
//       ? (p.productName?.toLowerCase().includes(lowerSearchProductName) || 
//          p.brand?.toLowerCase().includes(lowerSearchProductName))
//       : false;
    
//     const matchesCategoryText = searchCategoryText 
//       ? (p.cat?.toLowerCase().includes(lowerSearchCategoryText) || false)
//       : false;
    
//     const matchesCategoryDropdown = searchCategoryDropdown 
//       ? (p.cat === searchCategoryDropdown)
//       : false;
    
//     // Return true if product matches ANY active filter
//     return matchesProductName || matchesCategoryText || matchesCategoryDropdown;
//   });
// }

// // Group them by cat with null safety
// filtered.forEach((prod) => {
//   const catKey = prod.cat || "No Category";
//   if (!groupedProducts[catKey]) groupedProducts[catKey] = [];
//   groupedProducts[catKey].push(prod);
// });
//   /** ------------------------------------------------------------------
//    *  3. Editing logic (long press)
//    *  ------------------------------------------------------------------ */
//   const handlePointerDown = (id: string, field: keyof Product, currentValue: string) => {
//     longPressRef.current = window.setTimeout(() => {
//       setEditingCell({ id, field });
//       setEditValue(currentValue || "");
//     }, 500);
//   };

//   const handlePointerUpOrLeave = () => {
//     if (longPressRef.current) {
//       clearTimeout(longPressRef.current);
//       longPressRef.current = null;
//     }
//   };

//   const handleEditChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     setEditValue(e.target.value);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") handleEditSubmit();
//   };

//   const handleEditSubmit = async () => {
//     if (!editingCell) return;
//     const { id, field } = editingCell;

//     try {
//       const { error } = await supabase
//         .from("products")
//         .update({ [field]: editValue || null })
//         .eq("id", id);
//       if (error) throw error;

//       setProducts((prev) =>
//         prev.map((p) => (p.id === id ? { ...p, [field]: editValue || null } : p))
//       );
//     } catch (err: any) {
//       console.error("Error updating product:", err.message);
//       alert(err.message || "Error updating product. Please try again.");
//     } finally {
//       setEditingCell(null);
//       setEditValue("");
//     }
//   };

//   /** ------------------------------------------------------------------
//    *  4. Add product + image
//    *  ------------------------------------------------------------------ */
//   const handleAddProduct = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       if (!newProductName.trim()) {
//         setAlertMessage("Please provide a product name.");
//         return;
//       }
//       const { error } = await supabase.from("products").insert([
//         {
//           productName: newProductName,
//           brand: newBrand || null,
//           cat: newCat || null,
//           information: newInformation || "",
//           strength: newStrength || null,
//           formulation: newFormulation || null,
//           size: newSize || null,
//           price: newPrice || null,
//           productImage: newProductImageUrl || "",
//         },
//       ]);
//       if (error) throw error;

//       setAlertMessage("New product added successfully!");
//       // Reset
//       setNewProductName("");
//       setNewBrand("");
//       setNewCat("");
//       setNewInformation("");
//       setNewStrength("");
//       setNewFormulation("");
//       setNewSize("");
//       setNewPrice("");
//       setNewProductImageUrl("");
//       // Refresh
//       fetchAllProducts();
//     } catch (err: any) {
//       console.error("Error adding product:", err.message);
//       setAlertMessage(err.message || "Error adding product. Please try again.");
//     }
//   };

//   // Drag Over / Drop for new product
//   const handleAddProductDragOver = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };
//   const handleAddProductDrop = async (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       await doUploadFile(e.dataTransfer.files[0], "new");
//     }
//   };

//   // Generic upload method for "new", "modal", or "table"
//   const doUploadFile = async (file: File, mode: "new" | "modal" | "table", product?: Product) => {
//     try {
//       const fileExt = file.name.split(".").pop();
//       const fileName = `${Date.now()}.${fileExt}`;
//       const filePath = fileName;

//       const { error: uploadError } = await supabase.storage
//         .from("products")
//         .upload(filePath, file, { cacheControl: "3600", upsert: false });
//       if (uploadError) throw uploadError;

//       const { data } = supabase.storage.from("products").getPublicUrl(filePath);
//       if (!data.publicUrl) throw new Error("Failed to get public URL.");

//       if (mode === "new") {
//         // Setting the newly dropped image for the new product
//         setNewProductImageUrl(data.publicUrl);
//       } else if (mode === "modal") {
//         // Updating an existing product in the modal
//         if (!selectedProduct) return;
//         // DB update
//         await supabase
//           .from("products")
//           .update({ productImage: data.publicUrl })
//           .eq("id", selectedProduct.id);
//         // Local update
//         setProducts((prev) =>
//           prev.map((p) =>
//             p.id === selectedProduct.id ? { ...p, productImage: data.publicUrl } : p
//           )
//         );
//         setModalImageURL(data.publicUrl);
//       } else if (mode === "table") {
//         if (!product) return;
//         // DB update
//         await supabase
//           .from("products")
//           .update({ productImage: data.publicUrl })
//           .eq("id", product.id);
//         // Local update
//         setProducts((prev) =>
//           prev.map((p) =>
//             p.id === product.id ? { ...p, productImage: data.publicUrl } : p
//           )
//         );
//       }
//     } catch (error: any) {
//       console.error("Error uploading image:", error.message);
//       alert(error.message || "Error uploading image. Please try again.");
//     }
//   };

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       await doUploadFile(e.target.files[0], "new");
//     }
//   };

//   const handleCopy = () => {
//     if (newProductImageUrl) {
//       navigator.clipboard
//         .writeText(newProductImageUrl)
//         .then(() => alert("Image URL copied to clipboard!"))
//         .catch(() => alert("Failed to copy URL. Please try again."));
//     } else {
//       alert("No URL to copy.");
//     }
//   };

//   /** ------------------------------------------------------------------
//    *  5. Delete selected
//    *  ------------------------------------------------------------------ */
//   const handleDeleteSelected = async () => {
//     if (selectedProductIds.length === 0) return;
//     if (!window.confirm("Are you sure you want to delete the selected products?")) return;

//     try {
//       const { error } = await supabase.from("products").delete().in("id", selectedProductIds);
//       if (error) throw error;
//       setSelectedProductIds([]);
//       fetchAllProducts();
//     } catch (error: any) {
//       console.error("Error deleting selected products:", error.message);
//       setAlertMessage(error.message || "Error deleting selected products.");
//     }
//   };

//   /** ------------------------------------------------------------------
//    *  5b. DUPLICATE SELECTED
//    *  ------------------------------------------------------------------ */
//   const handleDuplicateSelected = async () => {
//     if (selectedProductIds.length === 0) return;
  
//     try {
//       // Gather selected products
//       const toDuplicate = products.filter((p) => selectedProductIds.includes(p.id));
      
//       // Get the highest ID from the database to generate new ones
//       const { data: maxIdData, error: maxIdError } = await supabase
//         .from("products")
//         .select("id")
//         .order("id", { ascending: false })
//         .limit(1);
        
//       if (maxIdError) throw maxIdError;
      
//       let nextId = 1;
//       if (maxIdData && maxIdData[0] && maxIdData[0].id) {
//         // Convert to number and increment
//         const lastId = maxIdData[0].id;
//         nextId = parseInt(lastId.toString()) + 1;
//       }
      
//       // Insert each as a new row with new ID
//       const inserts = toDuplicate.map(prod => ({
//         id: nextId++,
//         productName: `${prod.productName}`,
//         brand: prod.brand,
//         cat: prod.cat,
//         information: prod.information,
//         productImage: prod.productImage,
//         strength: prod.strength,
//         formulation: prod.formulation,
//         size: prod.size,
//         price: prod.price,
//       }));
      
//       const { error } = await supabase
//         .from("products")
//         .insert(inserts);
        
//       if (error) throw error;
      
//       alert("Products duplicated successfully!");
//       // Refresh
//       fetchAllProducts();
//     } catch (err: any) {
//       console.error("Error duplicating products:", err.message);
//       alert(err.message || "Error duplicating products. Please try again.");
//     }
//   };
//   /** ------------------------------------------------------------------
//    *  6. Product Modal
//    *  ------------------------------------------------------------------ */
//   const handleProductNameClick = (product: Product) => {
//     setSelectedProduct(product);
//     setModalImageURL(product.productImage || "");
//     setShowProductModal(true);
//   };

//   const handleModalImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!selectedProduct) return;
//     if (e.target.files && e.target.files[0]) {
//       await doUploadFile(e.target.files[0], "modal");
//     }
//   };

//   const handleModalDragOver = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };
//   const handleModalDrop = async (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (!selectedProduct) return;
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       await doUploadFile(e.dataTransfer.files[0], "modal");
//     }
//   };

//   const handleModalFieldChange = (field: keyof Product, value: string) => {
//     if (!selectedProduct) return;
//     setSelectedProduct((prev) => (prev ? { ...prev, [field]: value || null } : null));
//   };

//   const handleModalSave = async () => {
//     if (!selectedProduct) return;
//     try {
//       const { id, cat, productName, brand, information, formulation, strength, size, price } = selectedProduct;
//       const { error } = await supabase
//         .from("products")
//         .update({
//           cat: cat || null,
//           productName,
//           brand,
//           information,
//           formulation: formulation || null,
//           strength: strength || null,
//           size: size || null,
//           price: price || null,
//           productImage: modalImageURL,
//         })
//         .eq("id", id);
//       if (error) throw error;

//       // Update local
//       setProducts((prev) =>
//         prev.map((p) =>
//           p.id === id ? { ...p, cat, productName, brand, information, formulation, strength, size, price, productImage: modalImageURL } : p
//         )
//       );
//       setShowProductModal(false);
//     } catch (err: any) {
//       console.error("Error saving product changes:", err.message);
//       alert(err.message || "Error saving product changes. Please try again.");
//     }
//   };

//   /** ------------------------------------------------------------------
//    *  7. Table image drag-n-drop
//    *  ------------------------------------------------------------------ */
//   function handleTableImageDragOver(e: DragEvent<HTMLDivElement>, productId: string) {
//     e.preventDefault();
//     setDraggingProductId(productId);
//   }
//   function handleTableImageDragLeave() {
//     setDraggingProductId(null);
//   }
//   function handleTableImageDrop(e: DragEvent<HTMLDivElement>, product: Product) {
//     e.preventDefault();
//     setDraggingProductId(null);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       // "table" mode => pass the product to do the DB & local update
//       doUploadFile(e.dataTransfer.files[0], "table", product);
//     }
//   }

//   /** ------------------------------------------------------------------
//    *  8. Export ALL data to CSV
//    *  ------------------------------------------------------------------ */
//   const handleExportAllToExcel = () => {
//     const headers = [
//       "id",
//       "cat",
//       "productName",
//       "brand",
//       "information",
//       "productImage",
//       "strength",
//       "formulation",
//       "size",
//       "price",
//     ];
//     let csvContent = headers.join(",") + "\n";

//     products.forEach((p) => {
//       const row = [
//         p.id,
//         p.cat ?? "",
//         p.productName,
//         p.brand ?? "",
//         p.information,
//         p.productImage,
//         p.strength ?? "",
//         p.formulation ?? "",
//         p.size ?? "",
//         p.price ?? "",
//       ];
//       // Escape quotes
//       const escaped = row.map((val) => `"${val.replace(/"/g, '""')}"`);
//       csvContent += escaped.join(",") + "\n";
//     });

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "Products.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   /** ------------------------------------------------------------------
//    *  9. Selection logic
//    *  ------------------------------------------------------------------ */
//   const handleSelectRow = (id: string) => {
//     if (selectedProductIds.includes(id)) {
//       setSelectedProductIds(selectedProductIds.filter((selectedId) => selectedId !== id));
//     } else {
//       setSelectedProductIds([...selectedProductIds, id]);
//     }
//   };

//   // The "Select All" for each table's header
//   const handleSelectAll = () => {
//     const allIds = Object.values(groupedProducts).flat().map((p) => p.id);
//     // if they're all selected, unselect; else select them
//     if (selectedProductIds.length === allIds.length && allIds.length > 0) {
//       setSelectedProductIds([]);
//     } else {
//       setSelectedProductIds(allIds);
//     }
//   };

//   useEffect(() => {
//     // Check if all final filtered products are selected
//     const allIds = Object.values(groupedProducts).flat().map((p) => p.id);
//     if (allIds.length > 0 && allIds.every((id) => selectedProductIds.includes(id))) {
//       setIsAllSelected(true);
//     } else {
//       setIsAllSelected(false);
//     }
//   }, [selectedProductIds, groupedProducts]);

//   /** ------------------------------------------------------------------
//    *  10. Styles
//    *  ------------------------------------------------------------------ */
//   const styles: Record<string, CSSProperties> = {
//     container: {
//       width: "95%",
//       maxWidth: "1400px",
//       margin: "20px auto",
//       padding: "20px",
//       backgroundColor: "#121212",
//       boxShadow: "0 4px 20px 1px #007BA7",
//       borderRadius: "10px",
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       color: "#ffffff",
//     },
//     headerContainer: {
//       textAlign: "center",
//       marginBottom: "30px",
//     },
//     headerTitle: {
//       fontSize: "36px",
//       fontWeight: "700",
//       color: "#e0e0e0",
//     },
//     exportAllButton: {
//       backgroundColor: "#3ecf8e",
//       color: "#000",
//       border: "none",
//       borderRadius: "8px",
//       fontSize: "14px",
//       padding: "8px 16px",
//       cursor: "pointer",
//     },
//     topSection: {
//       display: "flex",
//       justifyContent: "space-between",
//       marginBottom: "30px",
//       flexWrap: "wrap",
//       gap: "20px",
//     },
//     filterContainer: {
//       backgroundColor: "#2a2a2a",
//       padding: "20px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 12px 1px #000",
//       flex: "1",
//       minWidth: "280px",
//       height: "360px",
//       display: "flex",
//       flexDirection: "column",
//       gap: "15px",
//     },
//     addProductContainer: {
//       backgroundColor: "#2a2a2a",
//       padding: "20px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 12px 1px #000",
//       flex: "1",
//       minWidth: "280px",
//     },
//     input: {
//       backgroundColor: "#555",
//       marginBottom: "10px",
//       color: "#fff",
//       padding: "10px",
//       fontSize: "17px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       width: "100%",
//     },
//     input2: {
//       backgroundColor: "#555",
//       marginBottom: "10px",
//       color: "#fff",
//       padding: "10px",
//       fontSize: "17px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       width: "120%",
//     },
//     textarea: {
//       backgroundColor: "#555",
//       marginBottom: "10px",
//       color: "#fff",
//       padding: "10px",
//       fontSize: "16px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       width: "100%",
//       height: "80px",
//       resize: "vertical",
//     },
//     dropdown: {
//       backgroundColor: "#555",
//       color: "#fff",
//       padding: "8px",
//       fontSize: "16px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       marginBottom: "10px",
//       width: "100%",
//     },
//     dropdown2: {
//       backgroundColor: "#555",
//       color: "#fff",
//       padding: "8px",
//       fontSize: "20px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       marginBottom: "10px",
//       width: "100%",
//     },
//     submitButton: {
//       backgroundColor: "#3ecf8e",
//       color: "#000",
//       border: "none",
//       borderRadius: "5px",
//       fontSize: "16px",
//       padding: "10px 20px",
//       cursor: "pointer",
//       marginTop: "5px",
//       width: "100%",
//     },
//     tableContainer: {
//       overflowX: "auto",
//       borderRadius: "10px",
//       backgroundColor: "#1e1e1e",
//       padding: "12px",
//       marginTop: "20px",
//     },
//     table: {
//       width: "100%",
//       borderCollapse: "collapse",
//       color: "#fff",
//       fontSize: "16px",
//       marginBottom: "20px",
//     },
//     th: {
//       border: "1px solid #555",
//       textAlign: "center",
//       padding: "10px",
//       backgroundColor: "#3ecf8e",
//       color: "#000",
//       fontSize: "18px",
//     },
//     td: {
//       border: "1px solid #555",
//       textAlign: "center",
//       padding: "10px",
//       color: "#fff",
//       cursor: "pointer",
//       position: "relative",
//       verticalAlign: "middle",
//       whiteSpace: "pre-wrap",
//     },
//     editInput: {
//       backgroundColor: "#555",
//       color: "#fff",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       padding: "5px",
//       fontSize: "16px",
//       outline: "none",
//       width: "100%",
//       textAlign: "left",
//     },
//     editSelect: {
//       backgroundColor: "#555",
//       color: "#fff",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       padding: "5px",
//       fontSize: "16px",
//       outline: "none",
//       width: "100%",
//       textAlign: "left",
//     },
//     tableImageContainer: {
//       width: "60px",
//       height: "60px",
//       margin: "0 auto",
//       position: "relative",
//       borderRadius: "5px",
//       overflow: "hidden",
//     },
//     tableImage: {
//       width: "100%",
//       height: "100%",
//       objectFit: "cover",
//     },
//     deleteButton: {
//       backgroundColor: "red",
//       color: "#fff",
//       border: "none",
//       borderRadius: "5px",
//       fontSize: "14px",
//       padding: "6px 12px",
//       cursor: "pointer",
//       marginRight: "8px",
//       marginBottom: "5px",
//       opacity: 0.4,
//       transition: "opacity 0.2s ease",
//     },
//     activeDeleteButton: {
//       backgroundColor: "red",
//       color: "#fff",
//       border: "none",
//       borderRadius: "5px",
//       fontSize: "14px",
//       padding: "6px 12px",
//       cursor: "pointer",
//       marginRight: "8px",
//       marginBottom: "5px",
//       opacity: 1,
//       transition: "opacity 0.2s ease",
//     },
//     inactiveDuplicateButton: {
//       backgroundColor: "#ADD8E6",
//       color: "#000",
//       border: "none",
//       borderRadius: "5px",
//       fontSize: "14px",
//       padding: "6px 12px",
//       cursor: "pointer",
//       marginRight: "728px",
//       marginBottom: "5px",
//       opacity: 0.4,
//       transition: "opacity 0.2s ease",
//     },
//     activeDuplicateButton: {
//       backgroundColor: "#ADD8E6",
//       color: "#000",
//       border: "none",
//       borderRadius: "5px",
//       fontSize: "14px",
//       padding: "6px 12px",
//       cursor: "pointer",
//       marginRight: "728px",
//       marginBottom: "5px",
//       opacity: 1,
//       transition: "opacity 0.2s ease",
//     },
//     checkbox: {
//       width: "20px",
//       height: "20px",
//       cursor: "pointer",
//     },
//     alertMessage: {
//       marginTop: "20px",
//       padding: "10px",
//       backgroundColor: "#ff4d4d",
//       color: "#fff",
//       borderRadius: "5px",
//       textAlign: "center",
//     },
//     modalOverlay: {
//       position: "fixed",
//       top: 0,
//       bottom: 0,
//       left: 0,
//       right: 0,
//       backgroundColor: "rgba(0, 0, 0, 0.6)",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       zIndex: 9999,
//     },
//     modalContent: {
//       backgroundColor: "#2a2a2a",
//       padding: "20px",
//       borderRadius: "10px",
//       width: "90%",
//       maxWidth: "500px",
//       position: "relative",
//     },
//     closeButton: {
//       position: "absolute",
//       top: "10px",
//       right: "10px",
//       backgroundColor: "#555",
//       color: "#fff",
//       border: "none",
//       borderRadius: "50%",
//       width: "30px",
//       height: "30px",
//       cursor: "pointer",
//       fontWeight: "bold",
//     },
//     modalImageContainer: {
//       position: "relative",
//       width: "100%",
//       textAlign: "center",
//       marginBottom: "20px",
//     },
//     modalImage: {
//       maxWidth: "100%",
//       maxHeight: "300px",
//       borderRadius: "10px",
//       objectFit: "cover",
//     },
//     penIconButton: {
//       position: "absolute",
//       top: "10px",
//       right: "10px",
//       backgroundColor: "#3f3f3f",
//       border: "none",
//       borderRadius: "50%",
//       width: "40px",
//       height: "40px",
//       cursor: "pointer",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       fontSize: "20px",
//       color: "yellow",
//     },
//   };

//   return (
//     <div style={{
//       backgroundColor: '#000',
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       overflow: 'auto', 
//     }}>
//       <div style={styles.container}>
//         <div style={styles.headerContainer}>
//           <h1 style={styles.headerTitle}>Dashboard2</h1>
//           <p style={{ color: "#b0b0b0" }}>Product Management</p>
//           <small style={{ color: "#888", fontSize: "12px" }}>
//             Formulation dropdown shows {allFormulations.length} options from database
//           </small>
//         </div>

//         {/* Top: Filter & Add Product */}
//         <div style={styles.topSection}>
//           {/* Search Container */}
//           <div style={styles.filterContainer}>
//             <h2 style={{ marginBottom: "10px", color: "#fff" }}>Search</h2>
//             {/* Search by product name or brand - FIXED */}
//             <input
//               type="text"
//               placeholder="Search product/brand..."
//               value={searchProductName}
//               onChange={(e) => setSearchProductName(e.target.value)}
//               style={styles.input}
//             />

//             {/* Search by Category text */}
//             <input
//               type="text"
//               placeholder="Search by Category text..."
//               value={searchCategoryText}
//               onChange={(e) => setSearchCategoryText(e.target.value)}
//               style={styles.input}
//             />

//             {/* Category dropdown (all categories from supabase) */}
//             <select
//               style={styles.dropdown}
//               value={searchCategoryDropdown}
//               onChange={(e) => setSearchCategoryDropdown(e.target.value)}
//             >
//               <option value="">All Categories</option>
//               {allCategories.map((cat) => (
//                 <option key={cat.id} value={cat.category}>
//                   {cat.category}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Add Product Container */}
//           <div
//             style={styles.addProductContainer}
//             onDragOver={handleAddProductDragOver}
//             onDrop={handleAddProductDrop}
//           >
//             <h2 style={{ marginBottom: "10px", color: "#fff" }}>Add New Product</h2>
//             <form onSubmit={handleAddProduct}>
//               {/* Product Name */}
//               <input
//                 type="text"
//                 value={newProductName}
//                 onChange={(e) => setNewProductName(e.target.value)}
//                 style={styles.input}
//                 placeholder="Product Name"
//                 required
//               />

//               {/* Brand Name */}
//               <input
//                 type="text"
//                 value={newBrand}
//                 onChange={(e) => setNewBrand(e.target.value)}
//                 style={styles.input}
//                 placeholder="Brand Name"
//               />

//               {/* Category Dropdown */}
//               <select
//                 style={styles.dropdown2}
//                 value={newCat}
//                 onChange={(e) => setNewCat(e.target.value)}
//               >
//                 <option value="">-- No Category --</option>
//                 {allCategories.map((cat) => (
//                   <option key={cat.id} value={cat.category}>
//                     {cat.category}
//                   </option>
//                 ))}
//               </select>

//               {/* Description (information) */}
//               <textarea
//                 value={newInformation}
//                 onChange={(e) => setNewInformation(e.target.value)}
//                 style={styles.textarea}
//                 placeholder="Product description..."
//               />

//               {/* Strength / Formulation / Size row */}
//               <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
//                 {/* Strength (25%) */}
//                 <input
//                   type="text"
//                   value={newStrength}
//                   onChange={(e) => setNewStrength(e.target.value)}
//                   style={{ ...styles.input, width: "25%", marginBottom: 0 }}
//                   placeholder="Strength"
//                 />
//                 {/* Formulation (50%) - NOW FROM DATABASE */}
//                 <select
//                   style={{ ...styles.dropdown, width: "50%", marginBottom: 0 }}
//                   value={newFormulation}
//                   onChange={(e) => setNewFormulation(e.target.value)}
//                 >
//                   <option value="">-- Formulation ({allFormulations.length} options) --</option>
//                   {allFormulations.map((f) => (
//                     <option key={f.id} value={f.formName}>
//                       {f.formName}
//                     </option>
//                   ))}
//                 </select>
//                 {/* Size (25%) */}
//                 <input
//                   type="text"
//                   value={newSize}
//                   onChange={(e) => setNewSize(e.target.value)}
//                   style={{ ...styles.input, width: "25%", marginBottom: 0 }}
//                   placeholder="Size"
//                 />
//               </div>

//               {/* Price (100%) */}
//               <input
//                 type="text"
//                 value={newPrice}
//                 onChange={(e) => setNewPrice(e.target.value)}
//                 style={styles.input}
//                 placeholder="Price"
//               />

//               {/* File input (hidden) */}
//               <input
//                 type="file"
//                 accept="image/*"
//                 id="product-image-input"
//                 style={{ display: "none" }}
//                 onChange={handleImageChange}
//               />

//               {/* Row: URL, Copy, Upload icons */}
//               <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
//                 <input
//                   type="text"
//                   value={newProductImageUrl}
//                   readOnly
//                   style={{ ...styles.input2, marginBottom: 0 }}
//                   placeholder="Image URL will appear here..."
//                 />
//                 {/* Copy button with icon */}
//                 <button
//                   type="button"
//                   onClick={handleCopy}
//                   disabled={!newProductImageUrl}
//                   style={{
//                     backgroundColor: "#ccc",
//                     border: "none",
//                     borderRadius: "50%",
//                     width: "34px",
//                     height: "34px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <img
//                     src="src/assets/copy.png"
//                     alt="Copy URL"
//                     style={{ width: "24px", height: "24px" }}
//                   />
//                 </button>
//                 {/* Upload button with icon */}
//                 <button
//                   type="button"
//                   onClick={() => document.getElementById("product-image-input")?.click()}
//                   style={{
//                     backgroundColor: "transparent",
//                     border: "none",
//                     borderRadius: "5px",
//                     padding: "6px 10px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <img
//                     src="src/assets/upload.png"
//                     alt="Upload"
//                     style={{ width: "30px", height: "30px" }}
//                   />
//                 </button>
//               </div>

//               {/* Preview image */}
//               {newProductImageUrl && (
//                 <img src={newProductImageUrl} alt="Preview" style={{ width: "60px", height: "60px" }} />
//               )}

//               <button type="submit" style={styles.submitButton}>
//                 Add Product
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Export ALL to Excel (CSV) */}
//         <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-10px" }}>
//           <button style={styles.exportAllButton} onClick={handleExportAllToExcel}>
//             Export to Excel
//           </button>
//         </div>

//         {/* Alert Modal */}
//         {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />}

//         {/*  Table(s) grouped by Category */}
//         {Object.keys(groupedProducts).length === 0 ? (
//           <p style={{ textAlign: "left", color: "#fff" }}>No products available.</p>
//         ) : (
//           Object.keys(groupedProducts).map((catName) => {
//             const catProducts = groupedProducts[catName];

//             return (
//               <div key={catName} style={styles.tableContainer}>
//                 {/* Duplicate + Delete buttons (above each category header) */}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <button
//                     style={
//                       selectedProductIds.length > 0
//                         ? styles.activeDeleteButton
//                         : styles.deleteButton
//                     }
//                     onClick={handleDeleteSelected}
//                     disabled={selectedProductIds.length === 0}
//                     aria-label="Delete Selected Products"
//                   >
//                     Delete Selected
//                   </button>

//                   <button
//                     style={
//                       selectedProductIds.length > 0
//                         ? styles.activeDuplicateButton
//                         : styles.inactiveDuplicateButton
//                     }
//                     onClick={handleDuplicateSelected}
//                     disabled={selectedProductIds.length === 0}
//                     aria-label="Duplicate Selected Products"
//                   >
//                     Duplicate
//                   </button>
//                 </div>

//                 {/* Category Header (bold, left-aligned, white) */}
//                 <h2
//                   style={{
//                     marginBottom: "10px",
//                     textAlign: "left",
//                     fontWeight: "bold",
//                     color: "#fff",
//                   }}
//                 >
//                   {catName === "No Category" ? "Uncategorized" : catName}
//                 </h2>

//                 <table style={styles.table}>
//                   <thead>
//                     <tr>
//                       <th style={styles.th}>
//                         <input
//                           type="checkbox"
//                           checked={isAllSelected}
//                           onChange={handleSelectAll}
//                           style={styles.checkbox}
//                         />
//                       </th>
//                       <th style={styles.th}>Image</th>
//                       <th style={styles.th}>Product Name</th>
//                       <th style={styles.th}>Brand</th>
//                       <th style={styles.th}>Strength</th>
//                       <th style={styles.th}>Formulation</th>
//                       <th style={styles.th}>Size</th>
//                       <th style={styles.th}>Price</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {catProducts.map((product) => {
//                       const isDraggingOver = draggingProductId === product.id;

//                       return (
//                         <tr key={product.id}>
//                           {/* Checkbox */}
//                           <td style={styles.td}>
//                             <input
//                               type="checkbox"
//                               checked={selectedProductIds.includes(product.id)}
//                               onChange={() => handleSelectRow(product.id)}
//                               style={styles.checkbox}
//                             />
//                           </td>

//                           {/* Image */}
//                           <td style={styles.td}>
//                             {editingCell?.id === product.id && editingCell.field === "productImage" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               <div
//                                 style={styles.tableImageContainer}
//                                 onDragOver={(e) => handleTableImageDragOver(e, product.id)}
//                                 onDragLeave={handleTableImageDragLeave}
//                                 onDrop={(e) => {
//                                   handleTableImageDrop(e, product);
//                                 }}
//                                 onPointerDown={() =>
//                                   handlePointerDown(product.id, "productImage", product.productImage || "")
//                                 }
//                                 onPointerUp={handlePointerUpOrLeave}
//                                 onPointerLeave={handlePointerUpOrLeave}
//                               >
//                                 <img
//                                   src={
//                                     product.productImage ||
//                                     "https://cdn-icons-png.flaticon.com/512/7936/7936338.png"
//                                   }
//                                   alt={product.productName}
//                                   style={{
//                                     ...styles.tableImage,
//                                     opacity: isDraggingOver ? 0.5 : 1,
//                                   }}
//                                 />
//                               </div>
//                             )}
//                           </td>

//                           {/* Product Name (opens modal on click) */}
//                           <td
//                             style={styles.td}
//                             onClick={() => handleProductNameClick(product)}
//                             onPointerDown={() =>
//                               handlePointerDown(product.id, "productName", product.productName)
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                           >
//                             {editingCell?.id === product.id &&
//                             editingCell.field === "productName" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               product.productName
//                             )}
//                           </td>

//                           {/* Brand */}
//                           <td
//                             style={styles.td}
//                             onPointerDown={() =>
//                               handlePointerDown(product.id, "brand", product.brand || "")
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                           >
//                             {editingCell?.id === product.id && editingCell.field === "brand" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               product.brand || ""
//                             )}
//                           </td>

//                           {/* Strength */}
//                           <td
//                             style={styles.td}
//                             onPointerDown={() =>
//                               handlePointerDown(product.id, "strength", product.strength || "")
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                           >
//                             {editingCell?.id === product.id && editingCell.field === "strength" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               product.strength || ""
//                             )}
//                           </td>

//                           {/* Formulation - NOW USING DROPDOWN */}
//                           <td
//                             style={styles.td}
//                             onPointerDown={() =>
//                               handlePointerDown(product.id, "formulation", product.formulation || "")
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                           >
//                             {editingCell?.id === product.id &&
//                             editingCell.field === "formulation" ? (
//                               <select
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editSelect}
//                               >
//                                 <option value="">-- Select Formulation --</option>
//                                 {allFormulations.map((f) => (
//                                   <option key={f.id} value={f.formName}>
//                                     {f.formName}
//                                   </option>
//                                 ))}
//                               </select>
//                             ) : (
//                               product.formulation || ""
//                             )}
//                           </td>

//                           {/* Size */}
//                           <td
//                             style={styles.td}
//                             onPointerDown={() =>
//                               handlePointerDown(product.id, "size", product.size || "")
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                           >
//                             {editingCell?.id === product.id && editingCell.field === "size" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               product.size || ""
//                             )}
//                           </td>

//                           {/* Price */}
//                           <td
//                             style={styles.td}
//                             onPointerDown={() =>
//                               handlePointerDown(product.id, "price", product.price || "")
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                           >
//                             {editingCell?.id === product.id && editingCell.field === "price" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               product.price || ""
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             );
//           })
//         )}

//         {/* Product Modal */}
//         {showProductModal && selectedProduct && (
//           <div style={styles.modalOverlay}>
//             <div style={styles.modalContent}>
//               <button
//                 style={styles.closeButton}
//                 onClick={() => setShowProductModal(false)}
//               >
//                 X
//               </button>

//               {/* Category Dropdown at top */}
//               <div style={{ marginBottom: "20px" }}>
//                 <select
//                   style={styles.dropdown}
//                   value={selectedProduct.cat || ""}
//                   onChange={(e) => handleModalFieldChange("cat", e.target.value)}
//                 >
//                   <option value="">-- No Category --</option>
//                   {allCategories.map((cat) => (
//                     <option key={cat.id} value={cat.category}>
//                       {cat.category}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Image with pen icon to upload a new one, plus drag-and-drop */}
//               <div
//                 style={styles.modalImageContainer}
//                 onDragOver={handleModalDragOver}
//                 onDrop={handleModalDrop}
//               >
//                 <img
//                   src={
//                     modalImageURL ||
//                     "https://cdn-icons-png.flaticon.com/512/7936/7936338.png"
//                   }
//                   alt="Product"
//                   style={styles.modalImage}
//                 />
//                 <button
//                   style={styles.penIconButton}
//                   onClick={() => {
//                     const input = document.getElementById("modal-file-input");
//                     if (input) input.click();
//                   }}
//                 >
//                   ✏️
//                 </button>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   id="modal-file-input"
//                   style={{ display: "none" }}
//                   onChange={handleModalImageChange}
//                 />
//               </div>

//               {/* Product Name */}
//               <input
//                 type="text"
//                 value={selectedProduct.productName}
//                 onChange={(e) => handleModalFieldChange("productName", e.target.value)}
//                 style={styles.input}
//               />

//               {/* Brand */}
//               <input
//                 type="text"
//                 value={selectedProduct.brand || ""}
//                 onChange={(e) => handleModalFieldChange("brand", e.target.value)}
//                 style={styles.input}
//                 placeholder="Brand"
//               />

//               {/* Price */}
//               <input
//                 type="text"
//                 value={selectedProduct.price || ""}
//                 onChange={(e) => handleModalFieldChange("price", e.target.value)}
//                 style={styles.input}
//                 placeholder="Price"
//               />

//               {/* Strength */}
//               <input
//                 type="text"
//                 value={selectedProduct.strength || ""}
//                 onChange={(e) => handleModalFieldChange("strength", e.target.value)}
//                 style={styles.input}
//                 placeholder="Strength"
//               />

//               {/* Formulation DROPDOWN - ADDED TO MODAL */}
//               <div style={{ marginBottom: "20px" }}>
//                 <select
//                   style={styles.dropdown}
//                   value={selectedProduct.formulation || ""}
//                   onChange={(e) => handleModalFieldChange("formulation", e.target.value)}
//                 >
//                   <option value="">-- Select Formulation --</option>
//                   {allFormulations.map((f) => (
//                     <option key={f.id} value={f.formName}>
//                       {f.formName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Size */}
//               <input
//                 type="text"
//                 value={selectedProduct.size || ""}
//                 onChange={(e) => handleModalFieldChange("size", e.target.value)}
//                 style={styles.input}
//                 placeholder="Size"
//               />

//               {/* Description (information) */}
//               <textarea
//                 value={selectedProduct.information}
//                 onChange={(e) => handleModalFieldChange("information", e.target.value)}
//                 style={styles.textarea}
//               />

//               <button
//                 style={{ ...styles.submitButton, marginTop: "10px" }}
//                 onClick={handleModalSave}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Dashboardstore2;
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   CSSProperties,
//   ReactNode,
//   DragEvent,
//   FormEvent,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import supabase from "../../supabase";

// /** ------------------------------------------------------------------
//  *  AlertModal (with optional children)
//  *  ------------------------------------------------------------------ */
// interface AlertModalProps {
//   message: string;
//   onClose: () => void;
//   children?: ReactNode;
// }

// function AlertModal({ message, onClose, children }: AlertModalProps) {
//   const overlayStyles: React.CSSProperties = {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 9999,
//   };
//   const modalStyles: React.CSSProperties = {
//     backgroundColor: "#2a2a2a",
//     padding: "20px",
//     borderRadius: "10px",
//     maxWidth: "450px",
//     width: "90%",
//     color: "#fff",
//     position: "relative",
//   };
//   const closeButtonStyles: React.CSSProperties = {
//     position: "absolute",
//     top: "10px",
//     right: "10px",
//     backgroundColor: "#555",
//     color: "#fff",
//     border: "none",
//     borderRadius: "50%",
//     width: "30px",
//     height: "30px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   };
//   const defaultCloseButton: React.CSSProperties = {
//     marginTop: "20px",
//     backgroundColor: "#3ecf8e",
//     color: "#000",
//     padding: "10px 20px",
//     border: "none",
//     borderRadius: "5px",
//     fontSize: "16px",
//     cursor: "pointer",
//   };

//   return (
//     <div style={overlayStyles}>
//       <div style={modalStyles}>
//         <button onClick={onClose} style={closeButtonStyles}>
//           X
//         </button>
//         <p style={{ marginBottom: "20px" }}>{message}</p>
//         {children}
//         <button onClick={onClose} style={defaultCloseButton}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }

// /** 
//  * The `products` table structure:
//  *  - id: string
//  *  - productName: string
//  *  - brand: string | null
//  *  - cat: string | null
//  *  - information: string
//  *  - productImage: string
//  *  - strength: string | null
//  *  - formulation: string | null
//  *  - size: string | null
//  *  - price: string | null
//  */
// interface Product {
//   id: string;
//   productName: string;
//   brand: string | null;
//   cat: string | null;
//   information: string;
//   productImage: string;
//   strength: string | null;
//   formulation: string | null;
//   size: string | null;
//   price: string | null;
// }

// /** 
//  * The `formulation` table structure:
//  *  - id: string
//  *  - formName: string
//  */
// interface FormulationOption {
//   id: string;
//   formName: string;
// }

// /** 
//  * The `category` table structure:
//  *  - id: string
//  *  - category: string
//  */
// interface CategoryData {
//   id: string;
//   category: string;
// }

// function Dashboardstore2() {
//   const navigate = useNavigate();

//   // Products & Formulations
//   const [products, setProducts] = useState<Product[]>([]);
//   const [allFormulations, setAllFormulations] = useState<FormulationOption[]>([]);

//   // For the category dropdown in search
//   const [allCategories, setAllCategories] = useState<CategoryData[]>([]);

//   // Editing logic
//   const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Product } | null>(null);
//   const [editValue, setEditValue] = useState<string>("");

//   // Alert messages
//   const [alertMessage, setAlertMessage] = useState<string>("");

//   // Add Product form
//   const [newProductName, setNewProductName] = useState("");
//   const [newBrand, setNewBrand] = useState("");
//   const [newCat, setNewCat] = useState("");
//   const [newInformation, setNewInformation] = useState("");
//   const [newStrength, setNewStrength] = useState("");
//   const [newFormulation, setNewFormulation] = useState("");
//   const [newSize, setNewSize] = useState("");
//   const [newPrice, setNewPrice] = useState("");
//   const [newProductImageUrl, setNewProductImageUrl] = useState("");

//   // Search: productName/brand and category text
//   const [searchProductName, setSearchProductName] = useState("");
//   const [searchCategoryText, setSearchCategoryText] = useState("");
//   // Also a category dropdown in search
//   const [searchCategoryDropdown, setSearchCategoryDropdown] = useState("");

//   // For long press
//   const longPressRef = useRef<number | null>(null);

//   // Modal
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [modalImageURL, setModalImageURL] = useState<string>("");

//   // For image drag styling
//   const [draggingProductId, setDraggingProductId] = useState<string | null>(null);

//   // Selection
//   const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
//   const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

//   /** ------------------------------------------------------------------
//    *  1. On mount, fetch data WITHOUT ADMIN check
//    *  ------------------------------------------------------------------ */
//   useEffect(() => {
//     fetchAllFormulations();
//     fetchAllCategories();
//     fetchAllProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchAllFormulations = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("formulation")
//         .select("*")
//         .order("formName", { ascending: true });
//       if (error) throw error;
//       if (data) setAllFormulations(data as FormulationOption[]);
//     } catch (error: any) {
//       console.error("Error fetching formulations:", error.message);
//     }
//   };

//   const fetchAllCategories = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("category")
//         .select("id, category")
//         .order("category", { ascending: true });
//       if (error) throw error;
//       if (data) setAllCategories(data as CategoryData[]);
//     } catch (error: any) {
//       console.error("Error fetching categories:", error.message);
//     }
//   };

//   const fetchAllProducts = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("products")
//         .select(
//           "id, productName, brand, cat, information, productImage, strength, formulation, size, price"
//         )
//         .order("productName", { ascending: true });
//       if (error) throw error;
//       if (data) setProducts(data as Product[]);
//     } catch (error: any) {
//       console.error("Error fetching products:", error.message);
//       setAlertMessage("Error fetching products. Please try again.");
//     }
//   };

//   /** ------------------------------------------------------------------
//    *  2. Group + Filter by search - FIXED VERSION
//    *  ------------------------------------------------------------------ */
//   const groupedProducts: Record<string, Product[]> = {};

//   // Filter step by step
//   let filtered = [...products];

//   // Filter by productName or brand - FIXED: Proper null handling
//   if (searchProductName) {
//     const lower = searchProductName.toLowerCase();
//     filtered = filtered.filter((p) => {
//       const nameMatch = p.productName?.toLowerCase().includes(lower) || false;
//       const brandMatch = p.brand?.toLowerCase().includes(lower) || false;
//       return nameMatch || brandMatch;
//     });
//   }

//   // Filter by category text - FIXED: Proper null handling
//   if (searchCategoryText) {
//     filtered = filtered.filter((p) => {
//       if (!p.cat) return false;
//       return p.cat.toLowerCase().includes(searchCategoryText.toLowerCase());
//     });
//   }

//   // Filter by category dropdown - FIXED: Proper null handling
//   if (searchCategoryDropdown) {
//     filtered = filtered.filter((p) => {
//       if (!p.cat) return false;
//       return p.cat === searchCategoryDropdown;
//     });
//   }

//   // Group them by cat with null safety
//   filtered.forEach((prod) => {
//     const catKey = prod.cat || "No Category";
//     if (!groupedProducts[catKey]) groupedProducts[catKey] = [];
//     groupedProducts[catKey].push(prod);
//   });

//   /** ------------------------------------------------------------------
//    *  3. Editing logic (long press)
//    *  ------------------------------------------------------------------ */
//   const handlePointerDown = (id: string, field: keyof Product, currentValue: string) => {
//     longPressRef.current = window.setTimeout(() => {
//       setEditingCell({ id, field });
//       setEditValue(currentValue || "");
//     }, 500);
//   };

//   const handlePointerUpOrLeave = () => {
//     if (longPressRef.current) {
//       clearTimeout(longPressRef.current);
//       longPressRef.current = null;
//     }
//   };

//   const handleEditChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     setEditValue(e.target.value);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") handleEditSubmit();
//   };

//   const handleEditSubmit = async () => {
//     if (!editingCell) return;
//     const { id, field } = editingCell;

//     try {
//       const { error } = await supabase
//         .from("products")
//         .update({ [field]: editValue || null })
//         .eq("id", id);
//       if (error) throw error;

//       setProducts((prev) =>
//         prev.map((p) => (p.id === id ? { ...p, [field]: editValue || null } : p))
//       );
//     } catch (err: any) {
//       console.error("Error updating product:", err.message);
//       alert(err.message || "Error updating product. Please try again.");
//     } finally {
//       setEditingCell(null);
//       setEditValue("");
//     }
//   };

//   /** ------------------------------------------------------------------
//    *  4. Add product + image
//    *  ------------------------------------------------------------------ */
//   const handleAddProduct = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       if (!newProductName.trim()) {
//         setAlertMessage("Please provide a product name.");
//         return;
//       }
//       const { error } = await supabase.from("products").insert([
//         {
//           productName: newProductName,
//           brand: newBrand || null,
//           cat: newCat || null,
//           information: newInformation || "",
//           strength: newStrength || null,
//           formulation: newFormulation || null,
//           size: newSize || null,
//           price: newPrice || null,
//           productImage: newProductImageUrl || "",
//         },
//       ]);
//       if (error) throw error;

//       setAlertMessage("New product added successfully!");
//       // Reset
//       setNewProductName("");
//       setNewBrand("");
//       setNewCat("");
//       setNewInformation("");
//       setNewStrength("");
//       setNewFormulation("");
//       setNewSize("");
//       setNewPrice("");
//       setNewProductImageUrl("");
//       // Refresh
//       fetchAllProducts();
//     } catch (err: any) {
//       console.error("Error adding product:", err.message);
//       setAlertMessage(err.message || "Error adding product. Please try again.");
//     }
//   };

//   // Drag Over / Drop for new product
//   const handleAddProductDragOver = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };
//   const handleAddProductDrop = async (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       await doUploadFile(e.dataTransfer.files[0], "new");
//     }
//   };

//   // Generic upload method for "new", "modal", or "table"
//   const doUploadFile = async (file: File, mode: "new" | "modal" | "table", product?: Product) => {
//     try {
//       const fileExt = file.name.split(".").pop();
//       const fileName = `${Date.now()}.${fileExt}`;
//       const filePath = fileName;

//       const { error: uploadError } = await supabase.storage
//         .from("products")
//         .upload(filePath, file, { cacheControl: "3600", upsert: false });
//       if (uploadError) throw uploadError;

//       const { data } = supabase.storage.from("products").getPublicUrl(filePath);
//       if (!data.publicUrl) throw new Error("Failed to get public URL.");

//       if (mode === "new") {
//         // Setting the newly dropped image for the new product
//         setNewProductImageUrl(data.publicUrl);
//       } else if (mode === "modal") {
//         // Updating an existing product in the modal
//         if (!selectedProduct) return;
//         // DB update
//         await supabase
//           .from("products")
//           .update({ productImage: data.publicUrl })
//           .eq("id", selectedProduct.id);
//         // Local update
//         setProducts((prev) =>
//           prev.map((p) =>
//             p.id === selectedProduct.id ? { ...p, productImage: data.publicUrl } : p
//           )
//         );
//         setModalImageURL(data.publicUrl);
//       } else if (mode === "table") {
//         if (!product) return;
//         // DB update
//         await supabase
//           .from("products")
//           .update({ productImage: data.publicUrl })
//           .eq("id", product.id);
//         // Local update
//         setProducts((prev) =>
//           prev.map((p) =>
//             p.id === product.id ? { ...p, productImage: data.publicUrl } : p
//           )
//         );
//       }
//     } catch (error: any) {
//       console.error("Error uploading image:", error.message);
//       alert(error.message || "Error uploading image. Please try again.");
//     }
//   };

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       await doUploadFile(e.target.files[0], "new");
//     }
//   };

//   const handleCopy = () => {
//     if (newProductImageUrl) {
//       navigator.clipboard
//         .writeText(newProductImageUrl)
//         .then(() => alert("Image URL copied to clipboard!"))
//         .catch(() => alert("Failed to copy URL. Please try again."));
//     } else {
//       alert("No URL to copy.");
//     }
//   };

//   /** ------------------------------------------------------------------
//    *  5. Delete selected
//    *  ------------------------------------------------------------------ */
//   const handleDeleteSelected = async () => {
//     if (selectedProductIds.length === 0) return;
//     if (!window.confirm("Are you sure you want to delete the selected products?")) return;

//     try {
//       const { error } = await supabase.from("products").delete().in("id", selectedProductIds);
//       if (error) throw error;
//       setSelectedProductIds([]);
//       fetchAllProducts();
//     } catch (error: any) {
//       console.error("Error deleting selected products:", error.message);
//       setAlertMessage(error.message || "Error deleting selected products.");
//     }
//   };

//   /** ------------------------------------------------------------------
//    *  5b. DUPLICATE SELECTED
//    *  ------------------------------------------------------------------ */
//   const handleDuplicateSelected = async () => {
//     if (selectedProductIds.length === 0) return;

//     try {
//       // Gather selected products
//       const toDuplicate = products.filter((p) => selectedProductIds.includes(p.id));
//       // Insert each as a new row
//       for (const prod of toDuplicate) {
//         const { error } = await supabase.from("products").insert({
//           productName: prod.productName,
//           brand: prod.brand,
//           cat: prod.cat,
//           information: prod.information,
//           productImage: prod.productImage,
//           strength: prod.strength,
//           formulation: prod.formulation,
//           size: prod.size,
//           price: prod.price,
//         });
//         if (error) throw error;
//       }
//       alert("Products duplicated successfully!");
//       // Refresh
//       fetchAllProducts();
//     } catch (err: any) {
//       console.error("Error duplicating products:", err.message);
//       alert(err.message || "Error duplicating products. Please try again.");
//     }
//   };

//   /** ------------------------------------------------------------------
//    *  6. Product Modal
//    *  ------------------------------------------------------------------ */
//   const handleProductNameClick = (product: Product) => {
//     setSelectedProduct(product);
//     setModalImageURL(product.productImage || "");
//     setShowProductModal(true);
//   };

//   const handleModalImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!selectedProduct) return;
//     if (e.target.files && e.target.files[0]) {
//       await doUploadFile(e.target.files[0], "modal");
//     }
//   };

//   const handleModalDragOver = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };
//   const handleModalDrop = async (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (!selectedProduct) return;
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       await doUploadFile(e.dataTransfer.files[0], "modal");
//     }
//   };

//   const handleModalFieldChange = (field: keyof Product, value: string) => {
//     if (!selectedProduct) return;
//     setSelectedProduct((prev) => (prev ? { ...prev, [field]: value || null } : null));
//   };

//   const handleModalSave = async () => {
//     if (!selectedProduct) return;
//     try {
//       const { id, cat, productName, brand, information } = selectedProduct;
//       const { error } = await supabase
//         .from("products")
//         .update({
//           cat: cat || null,
//           productName,
//           brand,
//           information,
//           productImage: modalImageURL,
//         })
//         .eq("id", id);
//       if (error) throw error;

//       // Update local
//       setProducts((prev) =>
//         prev.map((p) =>
//           p.id === id ? { ...p, cat, productName, brand, information, productImage: modalImageURL } : p
//         )
//       );
//       setShowProductModal(false);
//     } catch (err: any) {
//       console.error("Error saving product changes:", err.message);
//       alert(err.message || "Error saving product changes. Please try again.");
//     }
//   };

//   /** ------------------------------------------------------------------
//    *  7. Table image drag-n-drop
//    *  ------------------------------------------------------------------ */
//   function handleTableImageDragOver(e: DragEvent<HTMLDivElement>, productId: string) {
//     e.preventDefault();
//     setDraggingProductId(productId);
//   }
//   function handleTableImageDragLeave() {
//     setDraggingProductId(null);
//   }
//   function handleTableImageDrop(e: DragEvent<HTMLDivElement>, product: Product) {
//     e.preventDefault();
//     setDraggingProductId(null);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       // "table" mode => pass the product to do the DB & local update
//       doUploadFile(e.dataTransfer.files[0], "table", product);
//     }
//   }

//   /** ------------------------------------------------------------------
//    *  8. Export ALL data to CSV
//    *  ------------------------------------------------------------------ */
//   const handleExportAllToExcel = () => {
//     const headers = [
//       "id",
//       "cat",
//       "productName",
//       "brand",
//       "information",
//       "productImage",
//       "strength",
//       "formulation",
//       "size",
//       "price",
//     ];
//     let csvContent = headers.join(",") + "\n";

//     products.forEach((p) => {
//       const row = [
//         p.id,
//         p.cat ?? "",
//         p.productName,
//         p.brand ?? "",
//         p.information,
//         p.productImage,
//         p.strength ?? "",
//         p.formulation ?? "",
//         p.size ?? "",
//         p.price ?? "",
//       ];
//       // Escape quotes
//       const escaped = row.map((val) => `"${val.replace(/"/g, '""')}"`);
//       csvContent += escaped.join(",") + "\n";
//     });

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "Products.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   /** ------------------------------------------------------------------
//    *  9. Selection logic
//    *  ------------------------------------------------------------------ */
//   const handleSelectRow = (id: string) => {
//     if (selectedProductIds.includes(id)) {
//       setSelectedProductIds(selectedProductIds.filter((selectedId) => selectedId !== id));
//     } else {
//       setSelectedProductIds([...selectedProductIds, id]);
//     }
//   };

//   // The "Select All" for each table's header
//   const handleSelectAll = () => {
//     const allIds = Object.values(groupedProducts).flat().map((p) => p.id);
//     // if they're all selected, unselect; else select them
//     if (selectedProductIds.length === allIds.length && allIds.length > 0) {
//       setSelectedProductIds([]);
//     } else {
//       setSelectedProductIds(allIds);
//     }
//   };

//   useEffect(() => {
//     // Check if all final filtered products are selected
//     const allIds = Object.values(groupedProducts).flat().map((p) => p.id);
//     if (allIds.length > 0 && allIds.every((id) => selectedProductIds.includes(id))) {
//       setIsAllSelected(true);
//     } else {
//       setIsAllSelected(false);
//     }
//   }, [selectedProductIds, groupedProducts]);

//   /** ------------------------------------------------------------------
//    *  10. Styles
//    *  ------------------------------------------------------------------ */
//   const styles: Record<string, CSSProperties> = {
//     container: {
//       width: "95%",
//       maxWidth: "1400px",
//       margin: "20px auto",
//       padding: "20px",
//       backgroundColor: "#121212",
//       boxShadow: "0 4px 20px 1px #007BA7",
//       borderRadius: "10px",
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       color: "#ffffff",
//     },
//     headerContainer: {
//       textAlign: "center",
//       marginBottom: "30px",
//     },
//     headerTitle: {
//       fontSize: "36px",
//       fontWeight: "700",
//       color: "#e0e0e0",
//     },
//     exportAllButton: {
//       backgroundColor: "#3ecf8e",
//       color: "#000",
//       border: "none",
//       borderRadius: "8px",
//       fontSize: "14px",
//       padding: "8px 16px",
//       cursor: "pointer",
//     },
//     topSection: {
//       display: "flex",
//       justifyContent: "space-between",
//       marginBottom: "30px",
//       flexWrap: "wrap",
//       gap: "20px",
//     },
//     filterContainer: {
//       backgroundColor: "#2a2a2a",
//       padding: "20px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 12px 1px #000",
//       flex: "1",
//       minWidth: "280px",
//       height: "360px",
//       display: "flex",
//       flexDirection: "column",
//       gap: "15px",
//     },
//     addProductContainer: {
//       backgroundColor: "#2a2a2a",
//       padding: "20px",
//       borderRadius: "10px",
//       boxShadow: "0 2px 12px 1px #000",
//       flex: "1",
//       minWidth: "280px",
//     },
//     input: {
//       backgroundColor: "#555",
//       marginBottom: "10px",
//       color: "#fff",
//       padding: "10px",
//       fontSize: "17px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       width: "100%",
//     },
//     input2: {
//       backgroundColor: "#555",
//       marginBottom: "10px",
//       color: "#fff",
//       padding: "10px",
//       fontSize: "17px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       width: "120%",
//     },
//     textarea: {
//       backgroundColor: "#555",
//       marginBottom: "10px",
//       color: "#fff",
//       padding: "10px",
//       fontSize: "16px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       width: "100%",
//       height: "80px",
//       resize: "vertical",
//     },
//     dropdown: {
//       backgroundColor: "#555",
//       color: "#fff",
//       padding: "8px",
//       fontSize: "16px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       marginBottom: "10px",
//       width: "100%",
//     },
//     dropdown2: {
//       backgroundColor: "#555",
//       color: "#fff",
//       padding: "8px",
//       fontSize: "20px",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       outline: "none",
//       marginBottom: "10px",
//       width: "100%",
//     },
//     submitButton: {
//       backgroundColor: "#3ecf8e",
//       color: "#000",
//       border: "none",
//       borderRadius: "5px",
//       fontSize: "16px",
//       padding: "10px 20px",
//       cursor: "pointer",
//       marginTop: "5px",
//       width: "100%",
//     },
//     tableContainer: {
//       overflowX: "auto",
//       borderRadius: "10px",
//       backgroundColor: "#1e1e1e",
//       padding: "12px",
//       marginTop: "20px",
//     },
//     table: {
//       width: "100%",
//       borderCollapse: "collapse",
//       color: "#fff",
//       fontSize: "16px",
//       marginBottom: "20px",
//     },
//     th: {
//       border: "1px solid #555",
//       textAlign: "center",
//       padding: "10px",
//       backgroundColor: "#3ecf8e",
//       color: "#000",
//       fontSize: "18px",
//     },
//     td: {
//       border: "1px solid #555",
//       textAlign: "center",
//       padding: "10px",
//       color: "#fff",
//       cursor: "pointer",
//       position: "relative",
//       verticalAlign: "middle",
//       whiteSpace: "pre-wrap",
//     },
//     editInput: {
//       backgroundColor: "#555",
//       color: "#fff",
//       border: "1px solid #555",
//       borderRadius: "5px",
//       padding: "5px",
//       fontSize: "16px",
//       outline: "none",
//       width: "100%",
//       textAlign: "left",
//     },
//     tableImageContainer: {
//       width: "60px",
//       height: "60px",
//       margin: "0 auto",
//       position: "relative",
//       borderRadius: "5px",
//       overflow: "hidden",
//     },
//     tableImage: {
//       width: "100%",
//       height: "100%",
//       objectFit: "cover",
//     },
//     deleteButton: {
//       backgroundColor: "red",
//       color: "#fff",
//       border: "none",
//       borderRadius: "5px",
//       fontSize: "14px",
//       padding: "6px 12px",
//       cursor: "pointer",
//       marginRight: "8px",
//       marginBottom: "5px",
//       opacity: 0.4,
//       transition: "opacity 0.2s ease",
//     },
//     activeDeleteButton: {
//       backgroundColor: "red",
//       color: "#fff",
//       border: "none",
//       borderRadius: "5px",
//       fontSize: "14px",
//       padding: "6px 12px",
//       cursor: "pointer",
//       marginRight: "8px",
//       marginBottom: "5px",
//       opacity: 1,
//       transition: "opacity 0.2s ease",
//     },
//     inactiveDuplicateButton: {
//       backgroundColor: "#ADD8E6",
//       color: "#000",
//       border: "none",
//       borderRadius: "5px",
//       fontSize: "14px",
//       padding: "6px 12px",
//       cursor: "pointer",
//       marginRight: "728px",
//       marginBottom: "5px",
//       opacity: 0.4,
//       transition: "opacity 0.2s ease",
//     },
//     activeDuplicateButton: {
//       backgroundColor: "#ADD8E6",
//       color: "#000",
//       border: "none",
//       borderRadius: "5px",
//       fontSize: "14px",
//       padding: "6px 12px",
//       cursor: "pointer",
//       marginRight: "728px",
//       marginBottom: "5px",
//       opacity: 1,
//       transition: "opacity 0.2s ease",
//     },
//     checkbox: {
//       width: "20px",
//       height: "20px",
//       cursor: "pointer",
//     },
//     alertMessage: {
//       marginTop: "20px",
//       padding: "10px",
//       backgroundColor: "#ff4d4d",
//       color: "#fff",
//       borderRadius: "5px",
//       textAlign: "center",
//     },
//     modalOverlay: {
//       position: "fixed",
//       top: 0,
//       bottom: 0,
//       left: 0,
//       right: 0,
//       backgroundColor: "rgba(0, 0, 0, 0.6)",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       zIndex: 9999,
//     },
//     modalContent: {
//       backgroundColor: "#2a2a2a",
//       padding: "20px",
//       borderRadius: "10px",
//       width: "90%",
//       maxWidth: "500px",
//       position: "relative",
//     },
//     closeButton: {
//       position: "absolute",
//       top: "10px",
//       right: "10px",
//       backgroundColor: "#555",
//       color: "#fff",
//       border: "none",
//       borderRadius: "50%",
//       width: "30px",
//       height: "30px",
//       cursor: "pointer",
//       fontWeight: "bold",
//     },
//     modalImageContainer: {
//       position: "relative",
//       width: "100%",
//       textAlign: "center",
//       marginBottom: "20px",
//     },
//     modalImage: {
//       maxWidth: "100%",
//       maxHeight: "300px",
//       borderRadius: "10px",
//       objectFit: "cover",
//     },
//     penIconButton: {
//       position: "absolute",
//       top: "10px",
//       right: "10px",
//       backgroundColor: "#3f3f3f",
//       border: "none",
//       borderRadius: "50%",
//       width: "40px",
//       height: "40px",
//       cursor: "pointer",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       fontSize: "20px",
//       color: "yellow",
//     },
//   };

//   return (
//     <div style={{
//       backgroundColor: '#000',
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       overflow: 'auto', 
//     }}>
//       <div style={styles.container}>
//         <div style={styles.headerContainer}>
//           <h1 style={styles.headerTitle}>Dashboard2</h1>
//           <p style={{ color: "#b0b0b0" }}>Product Management</p>
//         </div>

//         {/* Top: Filter & Add Product */}
//         <div style={styles.topSection}>
//           {/* Search Container */}
//           <div style={styles.filterContainer}>
//             <h2 style={{ marginBottom: "10px", color: "#fff" }}>Search</h2>
//             {/* Search by product name or brand - FIXED */}
//             <input
//               type="text"
//               placeholder="Search product/brand..."
//               value={searchProductName}
//               onChange={(e) => setSearchProductName(e.target.value)}
//               style={styles.input}
//             />

//             {/* Search by Category text */}
//             <input
//               type="text"
//               placeholder="Search by Category text..."
//               value={searchCategoryText}
//               onChange={(e) => setSearchCategoryText(e.target.value)}
//               style={styles.input}
//             />

//             {/* Category dropdown (all categories from supabase) */}
//             <select
//               style={styles.dropdown}
//               value={searchCategoryDropdown}
//               onChange={(e) => setSearchCategoryDropdown(e.target.value)}
//             >
//               <option value="">All Categories</option>
//               {allCategories.map((cat) => (
//                 <option key={cat.id} value={cat.category}>
//                   {cat.category}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Add Product Container */}
//           <div
//             style={styles.addProductContainer}
//             onDragOver={handleAddProductDragOver}
//             onDrop={handleAddProductDrop}
//           >
//             <h2 style={{ marginBottom: "10px", color: "#fff" }}>Add New Product</h2>
//             <form onSubmit={handleAddProduct}>
//               {/* Product Name */}
//               <input
//                 type="text"
//                 value={newProductName}
//                 onChange={(e) => setNewProductName(e.target.value)}
//                 style={styles.input}
//                 placeholder="Product Name"
//                 required
//               />

//               {/* Brand Name */}
//               <input
//                 type="text"
//                 value={newBrand}
//                 onChange={(e) => setNewBrand(e.target.value)}
//                 style={styles.input}
//                 placeholder="Brand Name"
//               />

//               {/* Category Dropdown */}
//               <select
//                 style={styles.dropdown2}
//                 value={newCat}
//                 onChange={(e) => setNewCat(e.target.value)}
//               >
//                 <option value="">-- No Category --</option>
//                 {allCategories.map((cat) => (
//                   <option key={cat.id} value={cat.category}>
//                     {cat.category}
//                   </option>
//                 ))}
//               </select>

//               {/* Description (information) */}
//               <textarea
//                 value={newInformation}
//                 onChange={(e) => setNewInformation(e.target.value)}
//                 style={styles.textarea}
//                 placeholder="Product description..."
//               />

//               {/* Strength / Formulation / Size row */}
//               <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
//                 {/* Strength (25%) */}
//                 <input
//                   type="text"
//                   value={newStrength}
//                   onChange={(e) => setNewStrength(e.target.value)}
//                   style={{ ...styles.input, width: "25%", marginBottom: 0 }}
//                   placeholder="Strength"
//                 />
//                 {/* Formulation (40%) */}
//                 <select
//                   style={{ ...styles.dropdown, width: "50%", marginBottom: 0 }}
//                   value={newFormulation}
//                   onChange={(e) => setNewFormulation(e.target.value)}
//                 >
//                   <option value="">-- Formulation --</option>
//                   {allFormulations.map((f) => (
//                     <option key={f.id} value={f.formName}>
//                       {f.formName}
//                     </option>
//                   ))}
//                 </select>
//                 {/* Size (25%) */}
//                 <input
//                   type="text"
//                   value={newSize}
//                   onChange={(e) => setNewSize(e.target.value)}
//                   style={{ ...styles.input, width: "25%", marginBottom: 0 }}
//                   placeholder="Size"
//                 />
//               </div>

//               {/* Price (100%) */}
//               <input
//                 type="text"
//                 value={newPrice}
//                 onChange={(e) => setNewPrice(e.target.value)}
//                 style={styles.input}
//                 placeholder="Price"
//               />

//               {/* File input (hidden) */}
//               <input
//                 type="file"
//                 accept="image/*"
//                 id="product-image-input"
//                 style={{ display: "none" }}
//                 onChange={handleImageChange}
//               />

//               {/* Row: URL, Copy, Upload icons */}
//               <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
//                 <input
//                   type="text"
//                   value={newProductImageUrl}
//                   readOnly
//                   style={{ ...styles.input2, marginBottom: 0 }}
//                   placeholder="Image URL will appear here..."
//                 />
//                 {/* Copy button with icon */}
//                 <button
//                   type="button"
//                   onClick={handleCopy}
//                   disabled={!newProductImageUrl}
//                   style={{
//                     backgroundColor: "#ccc",
//                     border: "none",
//                     borderRadius: "50%",
//                     width: "34px",
//                     height: "34px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <img
//                     src="src/assets/copy.png"
//                     alt="Copy URL"
//                     style={{ width: "24px", height: "24px" }}
//                   />
//                 </button>
//                 {/* Upload button with icon */}
//                 <button
//                   type="button"
//                   onClick={() => document.getElementById("product-image-input")?.click()}
//                   style={{
//                     backgroundColor: "transparent",
//                     border: "none",
//                     borderRadius: "5px",
//                     padding: "6px 10px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <img
//                     src="src/assets/upload.png"
//                     alt="Upload"
//                     style={{ width: "30px", height: "30px" }}
//                   />
//                 </button>
//               </div>

//               {/* Preview image */}
//               {newProductImageUrl && (
//                 <img src={newProductImageUrl} alt="Preview" style={{ width: "60px", height: "60px" }} />
//               )}

//               <button type="submit" style={styles.submitButton}>
//                 Add Product
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Export ALL to Excel (CSV) */}
//         <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-10px" }}>
//           <button style={styles.exportAllButton} onClick={handleExportAllToExcel}>
//             Export to Excel
//           </button>
//         </div>

//         {/* Alert Modal */}
//         {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />}

//         {/*  Table(s) grouped by Category */}
//         {Object.keys(groupedProducts).length === 0 ? (
//           <p style={{ textAlign: "left", color: "#fff" }}>No products available.</p>
//         ) : (
//           Object.keys(groupedProducts).map((catName) => {
//             const catProducts = groupedProducts[catName];

//             return (
//               <div key={catName} style={styles.tableContainer}>
//                 {/* Duplicate + Delete buttons (above each category header) */}
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <button
//                     style={
//                       selectedProductIds.length > 0
//                         ? styles.activeDeleteButton
//                         : styles.deleteButton
//                     }
//                     onClick={handleDeleteSelected}
//                     disabled={selectedProductIds.length === 0}
//                     aria-label="Delete Selected Products"
//                   >
//                     Delete Selected
//                   </button>

//                   <button
//                     style={
//                       selectedProductIds.length > 0
//                         ? styles.activeDuplicateButton
//                         : styles.inactiveDuplicateButton
//                     }
//                     onClick={handleDuplicateSelected}
//                     disabled={selectedProductIds.length === 0}
//                     aria-label="Duplicate Selected Products"
//                   >
//                     Duplicate
//                   </button>
//                 </div>

//                 {/* Category Header (bold, left-aligned, white) */}
//                 <h2
//                   style={{
//                     marginBottom: "10px",
//                     textAlign: "left",
//                     fontWeight: "bold",
//                     color: "#fff",
//                   }}
//                 >
//                   {catName === "No Category" ? "Uncategorized" : catName}
//                 </h2>

//                 <table style={styles.table}>
//                   <thead>
//                     <tr>
//                       <th style={styles.th}>
//                         <input
//                           type="checkbox"
//                           checked={isAllSelected}
//                           onChange={handleSelectAll}
//                           style={styles.checkbox}
//                         />
//                       </th>
//                       <th style={styles.th}>Image</th>
//                       <th style={styles.th}>Product Name</th>
//                       <th style={styles.th}>Brand</th>
//                       <th style={styles.th}>Strength</th>
//                       <th style={styles.th}>Formulation</th>
//                       <th style={styles.th}>Size</th>
//                       <th style={styles.th}>Price</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {catProducts.map((product) => {
//                       const isDraggingOver = draggingProductId === product.id;

//                       return (
//                         <tr key={product.id}>
//                           {/* Checkbox */}
//                           <td style={styles.td}>
//                             <input
//                               type="checkbox"
//                               checked={selectedProductIds.includes(product.id)}
//                               onChange={() => handleSelectRow(product.id)}
//                               style={styles.checkbox}
//                             />
//                           </td>

//                           {/* Image */}
//                           <td style={styles.td}>
//                             {editingCell?.id === product.id && editingCell.field === "productImage" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               <div
//                                 style={styles.tableImageContainer}
//                                 onDragOver={(e) => handleTableImageDragOver(e, product.id)}
//                                 onDragLeave={handleTableImageDragLeave}
//                                 onDrop={(e) => {
//                                   handleTableImageDrop(e, product);
//                                 }}
//                                 onPointerDown={() =>
//                                   handlePointerDown(product.id, "productImage", product.productImage || "")
//                                 }
//                                 onPointerUp={handlePointerUpOrLeave}
//                                 onPointerLeave={handlePointerUpOrLeave}
//                               >
//                                 <img
//                                   src={
//                                     product.productImage ||
//                                     "https://cdn-icons-png.flaticon.com/512/7936/7936338.png"
//                                   }
//                                   alt={product.productName}
//                                   style={{
//                                     ...styles.tableImage,
//                                     opacity: isDraggingOver ? 0.5 : 1,
//                                   }}
//                                 />
//                               </div>
//                             )}
//                           </td>

//                           {/* Product Name (opens modal on click) */}
//                           <td
//                             style={styles.td}
//                             onClick={() => handleProductNameClick(product)}
//                             onPointerDown={() =>
//                               handlePointerDown(product.id, "productName", product.productName)
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                           >
//                             {editingCell?.id === product.id &&
//                             editingCell.field === "productName" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               product.productName
//                             )}
//                           </td>

//                           {/* Brand */}
//                           <td
//                             style={styles.td}
//                             onPointerDown={() =>
//                               handlePointerDown(product.id, "brand", product.brand || "")
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                           >
//                             {editingCell?.id === product.id && editingCell.field === "brand" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               product.brand || ""
//                             )}
//                           </td>

//                           {/* Strength */}
//                           <td
//                             style={styles.td}
//                             onPointerDown={() =>
//                               handlePointerDown(product.id, "strength", product.strength || "")
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                           >
//                             {editingCell?.id === product.id && editingCell.field === "strength" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               product.strength || ""
//                             )}
//                           </td>

//                           {/* Formulation */}
//                           <td
//                             style={styles.td}
//                             onPointerDown={() =>
//                               handlePointerDown(product.id, "formulation", product.formulation || "")
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                           >
//                             {editingCell?.id === product.id &&
//                             editingCell.field === "formulation" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               product.formulation || ""
//                             )}
//                           </td>

//                           {/* Size */}
//                           <td
//                             style={styles.td}
//                             onPointerDown={() =>
//                               handlePointerDown(product.id, "size", product.size || "")
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                           >
//                             {editingCell?.id === product.id && editingCell.field === "size" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               product.size || ""
//                             )}
//                           </td>

//                           {/* Price */}
//                           <td
//                             style={styles.td}
//                             onPointerDown={() =>
//                               handlePointerDown(product.id, "price", product.price || "")
//                             }
//                             onPointerUp={handlePointerUpOrLeave}
//                             onPointerLeave={handlePointerUpOrLeave}
//                           >
//                             {editingCell?.id === product.id && editingCell.field === "price" ? (
//                               <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={handleEditChange}
//                                 onBlur={handleEditSubmit}
//                                 onKeyDown={handleKeyDown}
//                                 autoFocus
//                                 style={styles.editInput}
//                               />
//                             ) : (
//                               product.price || ""
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             );
//           })
//         )}

//         {/* Product Modal */}
//         {showProductModal && selectedProduct && (
//           <div style={styles.modalOverlay}>
//             <div style={styles.modalContent}>
//               <button
//                 style={styles.closeButton}
//                 onClick={() => setShowProductModal(false)}
//               >
//                 X
//               </button>

//               {/* Category Dropdown at top */}
//               <div style={{ marginBottom: "20px" }}>
//                 <select
//                   style={styles.dropdown}
//                   value={selectedProduct.cat || ""}
//                   onChange={(e) => handleModalFieldChange("cat", e.target.value)}
//                 >
//                   <option value="">-- No Category --</option>
//                   {allCategories.map((cat) => (
//                     <option key={cat.id} value={cat.category}>
//                       {cat.category}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Image with pen icon to upload a new one, plus drag-and-drop */}
//               <div
//                 style={styles.modalImageContainer}
//                 onDragOver={handleModalDragOver}
//                 onDrop={handleModalDrop}
//               >
//                 <img
//                   src={
//                     modalImageURL ||
//                     "https://cdn-icons-png.flaticon.com/512/7936/7936338.png"
//                   }
//                   alt="Product"
//                   style={styles.modalImage}
//                 />
//                 <button
//                   style={styles.penIconButton}
//                   onClick={() => {
//                     const input = document.getElementById("modal-file-input");
//                     if (input) input.click();
//                   }}
//                 >
//                   ✏️
//                 </button>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   id="modal-file-input"
//                   style={{ display: "none" }}
//                   onChange={handleModalImageChange}
//                 />
//               </div>

//               {/* Product Name */}
//               <input
//                 type="text"
//                 value={selectedProduct.productName}
//                 onChange={(e) => handleModalFieldChange("productName", e.target.value)}
//                 style={styles.input}
//               />

//               {/* Brand */}
//               <input
//                 type="text"
//                 value={selectedProduct.brand || ""}
//                 onChange={(e) => handleModalFieldChange("brand", e.target.value)}
//                 style={styles.input}
//                 placeholder="Brand"
//               />

//               {/* Description (information) */}
//               <textarea
//                 value={selectedProduct.information}
//                 onChange={(e) => handleModalFieldChange("information", e.target.value)}
//                 style={styles.textarea}
//               />

//               <button
//                 style={{ ...styles.submitButton, marginTop: "10px" }}
//                 onClick={handleModalSave}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Dashboardstore2;
// // import React, {
// //   useState,
// //   useEffect,
// //   useRef,
// //   CSSProperties,
// //   ReactNode,
// //   DragEvent,
// //   FormEvent,
// // } from "react";
// // import { useNavigate } from "react-router-dom";
// // import supabase from "../../supabase";

// // /** ------------------------------------------------------------------
// //  *  AlertModal (with optional children)
// //  *  ------------------------------------------------------------------ */
// // interface AlertModalProps {
// //   message: string;
// //   onClose: () => void;
// //   children?: ReactNode;
// // }

// // function AlertModal({ message, onClose, children }: AlertModalProps) {
// //   const overlayStyles: React.CSSProperties = {
// //     position: "fixed",
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: "rgba(0, 0, 0, 0.6)",
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     zIndex: 9999,
// //   };
// //   const modalStyles: React.CSSProperties = {
// //     backgroundColor: "#2a2a2a",
// //     padding: "20px",
// //     borderRadius: "10px",
// //     maxWidth: "450px",
// //     width: "90%",
// //     color: "#fff",
// //     position: "relative",
// //   };
// //   const closeButtonStyles: React.CSSProperties = {
// //     position: "absolute",
// //     top: "10px",
// //     right: "10px",
// //     backgroundColor: "#555",
// //     color: "#fff",
// //     border: "none",
// //     borderRadius: "50%",
// //     width: "30px",
// //     height: "30px",
// //     cursor: "pointer",
// //     fontWeight: "bold",
// //   };
// //   const defaultCloseButton: React.CSSProperties = {
// //     marginTop: "20px",
// //     backgroundColor: "#3ecf8e",
// //     color: "#000",
// //     padding: "10px 20px",
// //     border: "none",
// //     borderRadius: "5px",
// //     fontSize: "16px",
// //     cursor: "pointer",
// //   };

// //   return (
// //     <div style={overlayStyles}>
// //       <div style={modalStyles}>
// //         <button onClick={onClose} style={closeButtonStyles}>
// //           X
// //         </button>
// //         <p style={{ marginBottom: "20px" }}>{message}</p>
// //         {children}
// //         <button onClick={onClose} style={defaultCloseButton}>
// //           Close
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // /** 
// //  * The `name` table structure:
// //  *  - id: string
// //  *  - productName: string
// //  *  - brand: string | null
// //  *  - cat: string | null
// //  *  - information: string
// //  *  - productImage: string
// //  *  - strength: string | null
// //  *  - formulation: string | null
// //  *  - size: string | null
// //  *  - price: string | null
// //  */
// // interface Product {
// //   id: string;
// //   productName: string;
// //   brand: string | null;
// //   cat: string | null;
// //   information: string;
// //   productImage: string;
// //   strength: string | null;
// //   formulation: string | null;
// //   size: string | null;
// //   price: string | null;
// // }

// // /** 
// //  * The `formulation` table structure:
// //  *  - id: string
// //  *  - formName: string
// //  */
// // interface FormulationOption {
// //   id: string;
// //   formName: string;
// // }

// // /** 
// //  * The `category` table structure:
// //  *  - id: string
// //  *  - category: string
// //  */
// // interface CategoryData {
// //   id: string;
// //   category: string;
// // }

// // function Dashboardstore2() {
// //   const navigate = useNavigate();

// //   // User role check
// //   const [role, setRole] = useState<string>("");

// //   // Products & Formulations
// //   const [products, setProducts] = useState<Product[]>([]);
// //   const [allFormulations, setAllFormulations] = useState<FormulationOption[]>([]);

// //   // For the category dropdown in search
// //   const [allCategories, setAllCategories] = useState<CategoryData[]>([]);

// //   // Editing logic
// //   const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Product } | null>(null);
// //   const [editValue, setEditValue] = useState<string>("");

// //   // Alert messages
// //   const [alertMessage, setAlertMessage] = useState<string>("");

// //   // Add Product form
// //   const [newProductName, setNewProductName] = useState("");
// //   const [newBrand, setNewBrand] = useState("");
// //   const [newCat, setNewCat] = useState("");
// //   const [newInformation, setNewInformation] = useState("");
// //   const [newStrength, setNewStrength] = useState("");
// //   const [newFormulation, setNewFormulation] = useState("");
// //   const [newSize, setNewSize] = useState("");
// //   const [newPrice, setNewPrice] = useState("");
// //   const [newProductImageUrl, setNewProductImageUrl] = useState("");

// //   // Search: productName/brand and category text
// //   const [searchProductName, setSearchProductName] = useState("");
// //   const [searchCategoryText, setSearchCategoryText] = useState("");
// //   // Also a category dropdown in search
// //   const [searchCategoryDropdown, setSearchCategoryDropdown] = useState("");

// //   // For long press
// //   const longPressRef = useRef<number | null>(null);

// //   // Modal
// //   const [showProductModal, setShowProductModal] = useState(false);
// //   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
// //   const [modalImageURL, setModalImageURL] = useState<string>("");

// //   // For image drag styling
// //   const [draggingProductId, setDraggingProductId] = useState<string | null>(null);

// //   // Selection
// //   const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
// //   const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

// //   /** ------------------------------------------------------------------
// //    *  1. On mount, fetch data and check ADMIN role
// //    *  ------------------------------------------------------------------ */
// //   useEffect(() => {
// //     fetchUserRole();
// //     fetchAllFormulations();
// //     fetchAllCategories();
// //     fetchAllProducts();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const fetchUserRole = async () => {
// //     try {
// //       const { data: userData } = await supabase.auth.getUser();
// //       if (!userData?.user) throw new Error("Not authenticated");

// //       // Check if user is ADMIN
// //       const { data: profileData, error } = await supabase
// //         .from("profiles")
// //         .select("role")
// //         .eq("id", userData.user.id)
// //         .single();

// //       if (error) throw error;
// //       if (profileData.role !== "ADMIN") {
// //         setAlertMessage("Access denied. ADMIN privileges required.");
// //         navigate("/home");
// //         return;
// //       }

// //       setRole(profileData.role);
// //     } catch (err) {
// //       console.error(err);
// //       navigate("/home");
// //     }
// //   };

// //   const fetchAllFormulations = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from("formulation")
// //         .select("*")
// //         .order("formName", { ascending: true });
// //       if (error) throw error;
// //       if (data) setAllFormulations(data as FormulationOption[]);
// //     } catch (error: any) {
// //       console.error("Error fetching formulations:", error.message);
// //     }
// //   };

// //   const fetchAllCategories = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from("category")
// //         .select("id, category")
// //         .order("category", { ascending: true });
// //       if (error) throw error;
// //       if (data) setAllCategories(data as CategoryData[]);
// //     } catch (error: any) {
// //       console.error("Error fetching categories:", error.message);
// //     }
// //   };

// //   const fetchAllProducts = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from("products")
// //         .select(
// //           "id, productName, brand, cat, information, productImage, strength, formulation, size, price"
// //         )
// //         .order("productName", { ascending: true });
// //       if (error) throw error;
// //       if (data) setProducts(data as Product[]);
// //     } catch (error: any) {
// //       console.error("Error fetching products:", error.message);
// //       setAlertMessage("Error fetching products. Please try again.");
// //     }
// //   };

// //   /** ------------------------------------------------------------------
// //    *  2. Group + Filter by search
// //    *  ------------------------------------------------------------------ */
// //   const groupedProducts: Record<string, Product[]> = {};

// //   // Filter step by step
// //   let filtered = [...products];

// //   // Filter by productName or brand
// //   if (searchProductName) {
// //     filtered = filtered.filter((p) => {
// //       const lower = searchProductName.toLowerCase();
// //       const nameMatch = p.productName.toLowerCase().includes(lower);
// //       const brandMatch = p.brand && p.brand.toLowerCase().includes(lower);
// //       return nameMatch || brandMatch;
// //     });
// //   }

// //   // Filter by category text
// //   if (searchCategoryText) {
// //     filtered = filtered.filter((p) => {
// //       if (!p.cat) return false;
// //       return p.cat.toLowerCase().includes(searchCategoryText.toLowerCase());
// //     });
// //   }

// //   // Filter by category dropdown
// //   if (searchCategoryDropdown) {
// //     filtered = filtered.filter((p) => p.cat === searchCategoryDropdown);
// //   }

// //   // Group them by cat
// //   filtered.forEach((prod) => {
// //     const catKey = prod.cat || "No Category";
// //     if (!groupedProducts[catKey]) groupedProducts[catKey] = [];
// //     groupedProducts[catKey].push(prod);
// //   });

// //   /** ------------------------------------------------------------------
// //    *  3. Editing logic (long press)
// //    *  ------------------------------------------------------------------ */
// //   const handlePointerDown = (id: string, field: keyof Product, currentValue: string) => {
// //     longPressRef.current = window.setTimeout(() => {
// //       setEditingCell({ id, field });
// //       setEditValue(currentValue);
// //     }, 500);
// //   };

// //   const handlePointerUpOrLeave = () => {
// //     if (longPressRef.current) {
// //       clearTimeout(longPressRef.current);
// //       longPressRef.current = null;
// //     }
// //   };

// //   const handleEditChange = (
// //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
// //   ) => {
// //     setEditValue(e.target.value);
// //   };

// //   const handleKeyDown = (e: React.KeyboardEvent) => {
// //     if (e.key === "Enter") handleEditSubmit();
// //   };

// //   const handleEditSubmit = async () => {
// //     if (!editingCell) return;
// //     const { id, field } = editingCell;

// //     try {
// //       const { error } = await supabase
// //         .from("products")
// //         .update({ [field]: editValue })
// //         .eq("id", id);
// //       if (error) throw error;

// //       setProducts((prev) =>
// //         prev.map((p) => (p.id === id ? { ...p, [field]: editValue } : p))
// //       );
// //     } catch (err: any) {
// //       console.error("Error updating product:", err.message);
// //       alert(err.message || "Error updating product. Please try again.");
// //     } finally {
// //       setEditingCell(null);
// //       setEditValue("");
// //     }
// //   };

// //   /** ------------------------------------------------------------------
// //    *  4. Add product + image
// //    *  ------------------------------------------------------------------ */
// //   const handleAddProduct = async (e: FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       if (!newProductName.trim()) {
// //         setAlertMessage("Please provide a product name.");
// //         return;
// //       }
// //       const { error } = await supabase.from("products").insert([
// //         {
// //           productName: newProductName,
// //           brand: newBrand || null,
// //           cat: newCat || null,
// //           information: newInformation || "",
// //           strength: newStrength || null,
// //           formulation: newFormulation || null,
// //           size: newSize || null,
// //           price: newPrice || null,
// //           productImage: newProductImageUrl || "",
// //         },
// //       ]);
// //       if (error) throw error;

// //       setAlertMessage("New product added successfully!");
// //       // Reset
// //       setNewProductName("");
// //       setNewBrand("");
// //       setNewCat("");
// //       setNewInformation("");
// //       setNewStrength("");
// //       setNewFormulation("");
// //       setNewSize("");
// //       setNewPrice("");
// //       setNewProductImageUrl("");
// //       // Refresh
// //       fetchAllProducts();
// //     } catch (err: any) {
// //       console.error("Error adding product:", err.message);
// //       setAlertMessage(err.message || "Error adding product. Please try again.");
// //     }
// //   };

// //   // Drag Over / Drop for new product
// //   const handleAddProductDragOver = (e: DragEvent<HTMLDivElement>) => {
// //     e.preventDefault();
// //   };
// //   const handleAddProductDrop = async (e: DragEvent<HTMLDivElement>) => {
// //     e.preventDefault();
// //     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
// //       await doUploadFile(e.dataTransfer.files[0], "new");
// //     }
// //   };

// //   // Generic upload method for "new", "modal", or "table"
// //   const doUploadFile = async (file: File, mode: "new" | "modal" | "table", product?: Product) => {
// //     try {
// //       const fileExt = file.name.split(".").pop();
// //       const fileName = `${Date.now()}.${fileExt}`;
// //       const filePath = fileName;

// //       const { error: uploadError } = await supabase.storage
// //         .from("products")
// //         .upload(filePath, file, { cacheControl: "3600", upsert: false });
// //       if (uploadError) throw uploadError;

// //       const { data } = supabase.storage.from("products").getPublicUrl(filePath);
// //       if (!data.publicUrl) throw new Error("Failed to get public URL.");

// //       if (mode === "new") {
// //         // Setting the newly dropped image for the new product
// //         setNewProductImageUrl(data.publicUrl);
// //       } else if (mode === "modal") {
// //         // Updating an existing product in the modal
// //         if (!selectedProduct) return;
// //         // DB update
// //         await supabase
// //           .from("products")
// //           .update({ productImage: data.publicUrl })
// //           .eq("id", selectedProduct.id);
// //         // Local update
// //         setProducts((prev) =>
// //           prev.map((p) =>
// //             p.id === selectedProduct.id ? { ...p, productImage: data.publicUrl } : p
// //           )
// //         );
// //         setModalImageURL(data.publicUrl);
// //       } else if (mode === "table") {
// //         if (!product) return;
// //         // DB update
// //         await supabase
// //           .from("products")
// //           .update({ productImage: data.publicUrl })
// //           .eq("id", product.id);
// //         // Local update
// //         setProducts((prev) =>
// //           prev.map((p) =>
// //             p.id === product.id ? { ...p, productImage: data.publicUrl } : p
// //           )
// //         );
// //       }
// //     } catch (error: any) {
// //       console.error("Error uploading image:", error.message);
// //       alert(error.message || "Error uploading image. Please try again.");
// //     }
// //   };

// //   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files && e.target.files[0]) {
// //       await doUploadFile(e.target.files[0], "new");
// //     }
// //   };

// //   const handleCopy = () => {
// //     if (newProductImageUrl) {
// //       navigator.clipboard
// //         .writeText(newProductImageUrl)
// //         .then(() => alert("Image URL copied to clipboard!"))
// //         .catch(() => alert("Failed to copy URL. Please try again."));
// //     } else {
// //       alert("No URL to copy.");
// //     }
// //   };

// //   /** ------------------------------------------------------------------
// //    *  5. Delete selected
// //    *  ------------------------------------------------------------------ */
// //   const handleDeleteSelected = async () => {
// //     if (selectedProductIds.length === 0) return;
// //     if (!window.confirm("Are you sure you want to delete the selected products?")) return;

// //     try {
// //       const { error } = await supabase.from("products").delete().in("id", selectedProductIds);
// //       if (error) throw error;
// //       setSelectedProductIds([]);
// //       fetchAllProducts();
// //     } catch (error: any) {
// //       console.error("Error deleting selected products:", error.message);
// //       setAlertMessage(error.message || "Error deleting selected products.");
// //     }
// //   };

// //   /** ------------------------------------------------------------------
// //    *  5b. DUPLICATE SELECTED
// //    *  ------------------------------------------------------------------ */
// //   const handleDuplicateSelected = async () => {
// //     if (selectedProductIds.length === 0) return;

// //     try {
// //       // Gather selected products
// //       const toDuplicate = products.filter((p) => selectedProductIds.includes(p.id));
// //       // Insert each as a new row
// //       for (const prod of toDuplicate) {
// //         const { error } = await supabase.from("products").insert({
// //           productName: prod.productName,
// //           brand: prod.brand,
// //           cat: prod.cat,
// //           information: prod.information,
// //           productImage: prod.productImage,
// //           strength: prod.strength,
// //           formulation: prod.formulation,
// //           size: prod.size,
// //           price: prod.price,
// //         });
// //         if (error) throw error;
// //       }
// //       alert("Products duplicated successfully!");
// //       // Refresh
// //       fetchAllProducts();
// //     } catch (err: any) {
// //       console.error("Error duplicating products:", err.message);
// //       alert(err.message || "Error duplicating products. Please try again.");
// //     }
// //   };

// //   /** ------------------------------------------------------------------
// //    *  6. Product Modal
// //    *  ------------------------------------------------------------------ */
// //   const handleProductNameClick = (product: Product) => {
// //     setSelectedProduct(product);
// //     setModalImageURL(product.productImage || "");
// //     setShowProductModal(true);
// //   };

// //   const handleModalImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (!selectedProduct) return;
// //     if (e.target.files && e.target.files[0]) {
// //       await doUploadFile(e.target.files[0], "modal");
// //     }
// //   };

// //   const handleModalDragOver = (e: DragEvent<HTMLDivElement>) => {
// //     e.preventDefault();
// //   };
// //   const handleModalDrop = async (e: DragEvent<HTMLDivElement>) => {
// //     e.preventDefault();
// //     if (!selectedProduct) return;
// //     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
// //       await doUploadFile(e.dataTransfer.files[0], "modal");
// //     }
// //   };

// //   const handleModalFieldChange = (field: keyof Product, value: string) => {
// //     if (!selectedProduct) return;
// //     setSelectedProduct((prev) => (prev ? { ...prev, [field]: value } : null));
// //   };

// //   const handleModalSave = async () => {
// //     if (!selectedProduct) return;
// //     try {
// //       const { id, cat, productName, brand, information } = selectedProduct;
// //       const { error } = await supabase
// //         .from("products")
// //         .update({
// //           cat: cat || null,
// //           productName,
// //           brand,
// //           information,
// //           productImage: modalImageURL,
// //         })
// //         .eq("id", id);
// //       if (error) throw error;

// //       // Update local
// //       setProducts((prev) =>
// //         prev.map((p) =>
// //           p.id === id ? { ...p, cat, productName, brand, information, productImage: modalImageURL } : p
// //         )
// //       );
// //       setShowProductModal(false);
// //     } catch (err: any) {
// //       console.error("Error saving product changes:", err.message);
// //       alert(err.message || "Error saving product changes. Please try again.");
// //     }
// //   };

// //   /** ------------------------------------------------------------------
// //    *  7. Table image drag-n-drop
// //    *  ------------------------------------------------------------------ */
// //   function handleTableImageDragOver(e: DragEvent<HTMLDivElement>, productId: string) {
// //     e.preventDefault();
// //     setDraggingProductId(productId);
// //   }
// //   function handleTableImageDragLeave() {
// //     setDraggingProductId(null);
// //   }
// //   function handleTableImageDrop(e: DragEvent<HTMLDivElement>, product: Product) {
// //     e.preventDefault();
// //     setDraggingProductId(null);
// //     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
// //       // "table" mode => pass the product to do the DB & local update
// //       doUploadFile(e.dataTransfer.files[0], "table", product);
// //     }
// //   }

// //   /** ------------------------------------------------------------------
// //    *  8. Export ALL data to CSV
// //    *  ------------------------------------------------------------------ */
// //   const handleExportAllToExcel = () => {
// //     const headers = [
// //       "id",
// //       "cat",
// //       "productName",
// //       "brand",
// //       "information",
// //       "productImage",
// //       "strength",
// //       "formulation",
// //       "size",
// //       "price",
// //     ];
// //     let csvContent = headers.join(",") + "\n";

// //     products.forEach((p) => {
// //       const row = [
// //         p.id,
// //         p.cat ?? "",
// //         p.productName,
// //         p.brand ?? "",
// //         p.information,
// //         p.productImage,
// //         p.strength ?? "",
// //         p.formulation ?? "",
// //         p.size ?? "",
// //         p.price ?? "",
// //       ];
// //       // Escape quotes
// //       const escaped = row.map((val) => `"${val.replace(/"/g, '""')}"`);
// //       csvContent += escaped.join(",") + "\n";
// //     });

// //     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
// //     const url = URL.createObjectURL(blob);

// //     const link = document.createElement("a");
// //     link.href = url;
// //     link.setAttribute("download", "Products.csv");
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
// //   };

// //   /** ------------------------------------------------------------------
// //    *  9. Selection logic
// //    *  ------------------------------------------------------------------ */
// //   const handleSelectRow = (id: string) => {
// //     if (selectedProductIds.includes(id)) {
// //       setSelectedProductIds(selectedProductIds.filter((selectedId) => selectedId !== id));
// //     } else {
// //       setSelectedProductIds([...selectedProductIds, id]);
// //     }
// //   };

// //   // The "Select All" for each table's header
// //   const handleSelectAll = () => {
// //     const allIds = Object.values(groupedProducts).flat().map((p) => p.id);
// //     // if they're all selected, unselect; else select them
// //     if (selectedProductIds.length === allIds.length && allIds.length > 0) {
// //       setSelectedProductIds([]);
// //     } else {
// //       setSelectedProductIds(allIds);
// //     }
// //   };

// //   useEffect(() => {
// //     // Check if all final filtered products are selected
// //     const allIds = Object.values(groupedProducts).flat().map((p) => p.id);
// //     if (allIds.length > 0 && allIds.every((id) => selectedProductIds.includes(id))) {
// //       setIsAllSelected(true);
// //     } else {
// //       setIsAllSelected(false);
// //     }
// //   }, [selectedProductIds, groupedProducts]);

// //   /** ------------------------------------------------------------------
// //    *  10. Styles
// //    *  ------------------------------------------------------------------ */
// //   const styles: Record<string, CSSProperties> = {
// //     container: {
// //       width: "95%",
// //       maxWidth: "1400px",
// //       margin: "20px auto",
// //       padding: "20px",
// //       backgroundColor: "#121212",
// //       boxShadow: "0 4px 20px 1px #007BA7",
// //       borderRadius: "10px",
// //       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
// //       color: "#ffffff",
// //     },
// //     headerContainer: {
// //       textAlign: "center",
// //       marginBottom: "30px",
// //     },
// //     headerTitle: {
// //       fontSize: "36px",
// //       fontWeight: "700",
// //       color: "#e0e0e0",
// //     },
// //     exportAllButton: {
// //       backgroundColor: "#3ecf8e",
// //       color: "#000",
// //       border: "none",
// //       borderRadius: "8px",
// //       fontSize: "14px",
// //       padding: "8px 16px",
// //       cursor: "pointer",
// //     },
// //     topSection: {
// //       display: "flex",
// //       justifyContent: "space-between",
// //       marginBottom: "30px",
// //       flexWrap: "wrap",
// //       gap: "20px",
// //     },
// //     filterContainer: {
// //       backgroundColor: "#2a2a2a",
// //       padding: "20px",
// //       borderRadius: "10px",
// //       boxShadow: "0 2px 12px 1px #000",
// //       flex: "1",
// //       minWidth: "280px",
// //       height: "360px",
// //       display: "flex",
// //       flexDirection: "column",
// //       gap: "15px",
// //     },
// //     addProductContainer: {
// //       backgroundColor: "#2a2a2a",
// //       padding: "20px",
// //       borderRadius: "10px",
// //       boxShadow: "0 2px 12px 1px #000",
// //       flex: "1",
// //       minWidth: "280px",
// //     },
// //     input: {
// //       backgroundColor: "#555",
// //       marginBottom: "10px",
// //       color: "#fff",
// //       padding: "10px",
// //       fontSize: "17px",
// //       border: "1px solid #555",
// //       borderRadius: "5px",
// //       outline: "none",
// //       width: "100%",
// //     },
// //     input2: {
// //       backgroundColor: "#555",
// //       marginBottom: "10px",
// //       color: "#fff",
// //       padding: "10px",
// //       fontSize: "17px",
// //       border: "1px solid #555",
// //       borderRadius: "5px",
// //       outline: "none",
// //       width: "120%",
// //     },
// //     textarea: {
// //       backgroundColor: "#555",
// //       marginBottom: "10px",
// //       color: "#fff",
// //       padding: "10px",
// //       fontSize: "16px",
// //       border: "1px solid #555",
// //       borderRadius: "5px",
// //       outline: "none",
// //       width: "100%",
// //       height: "80px",
// //       resize: "vertical",
// //     },
// //     dropdown: {
// //       backgroundColor: "#555",
// //       color: "#fff",
// //       padding: "8px",
// //       fontSize: "16px",
// //       border: "1px solid #555",
// //       borderRadius: "5px",
// //       outline: "none",
// //       marginBottom: "10px",
// //       width: "100%",
// //     },
// //     dropdown2: {
// //       backgroundColor: "#555",
// //       color: "#fff",
// //       padding: "8px",
// //       fontSize: "20px",
// //       border: "1px solid #555",
// //       borderRadius: "5px",
// //       outline: "none",
// //       marginBottom: "10px",
// //       width: "100%",
// //     },
// //     submitButton: {
// //       backgroundColor: "#3ecf8e",
// //       color: "#000",
// //       border: "none",
// //       borderRadius: "5px",
// //       fontSize: "16px",
// //       padding: "10px 20px",
// //       cursor: "pointer",
// //       marginTop: "5px",
// //       width: "100%",
// //     },
// //     tableContainer: {
// //       overflowX: "auto",
// //       borderRadius: "10px",
// //       backgroundColor: "#1e1e1e",
// //       padding: "12px",
// //       marginTop: "20px",
// //     },
// //     table: {
// //       width: "100%",
// //       borderCollapse: "collapse",
// //       color: "#fff",
// //       fontSize: "16px",
// //       marginBottom: "20px",
// //     },
// //     th: {
// //       border: "1px solid #555",
// //       textAlign: "center",
// //       padding: "10px",
// //       backgroundColor: "#3ecf8e",
// //       color: "#000",
// //       fontSize: "18px",
// //     },
// //     td: {
// //       border: "1px solid #555",
// //       textAlign: "center",
// //       padding: "10px",
// //       color: "#fff",
// //       cursor: "pointer",
// //       position: "relative",
// //       verticalAlign: "middle",
// //       whiteSpace: "pre-wrap",
// //     },
// //     editInput: {
// //       backgroundColor: "#555",
// //       color: "#fff",
// //       border: "1px solid #555",
// //       borderRadius: "5px",
// //       padding: "5px",
// //       fontSize: "16px",
// //       outline: "none",
// //       width: "100%",
// //       textAlign: "left",
// //     },
// //     tableImageContainer: {
// //       width: "60px",
// //       height: "60px",
// //       margin: "0 auto",
// //       position: "relative",
// //       borderRadius: "5px",
// //       overflow: "hidden",
// //     },
// //     tableImage: {
// //       width: "100%",
// //       height: "100%",
// //       objectFit: "cover",
// //     },
// //     // Original delete button styles
// //     deleteButton: {
// //       backgroundColor: "red",
// //       color: "#fff",
// //       border: "none",
// //       borderRadius: "5px",
// //       fontSize: "14px",
// //       padding: "6px 12px",
// //       cursor: "pointer",
// //       marginRight: "8px",
// //       marginBottom: "5px",
// //       opacity: 0.4,
// //       transition: "opacity 0.2s ease",
// //     },
// //     activeDeleteButton: {
// //       backgroundColor: "red",
// //       color: "#fff",
// //       border: "none",
// //       borderRadius: "5px",
// //       fontSize: "14px",
// //       padding: "6px 12px",
// //       cursor: "pointer",
// //       marginRight: "8px",
// //       marginBottom: "5px",
// //       opacity: 1,
// //       transition: "opacity 0.2s ease",
// //     },
// //     // NEW duplicate button styles
// //     inactiveDuplicateButton: {
// //       backgroundColor: "#ADD8E6",
// //       color: "#000",
// //       border: "none",
// //       borderRadius: "5px",
// //       fontSize: "14px",
// //       padding: "6px 12px",
// //       cursor: "pointer",
// //       marginRight: "728px",
// //       marginBottom: "5px",
// //       opacity: 0.4,
// //       transition: "opacity 0.2s ease",
// //     },
// //     activeDuplicateButton: {
// //       backgroundColor: "#ADD8E6",
// //       color: "#000",
// //       border: "none",
// //       borderRadius: "5px",
// //       fontSize: "14px",
// //       padding: "6px 12px",
// //       cursor: "pointer",
// //       marginRight: "728px",
// //       marginBottom: "5px",
// //       opacity: 1,
// //       transition: "opacity 0.2s ease",
// //     },
// //     checkbox: {
// //       width: "20px",
// //       height: "20px",
// //       cursor: "pointer",
// //     },
// //     alertMessage: {
// //       marginTop: "20px",
// //       padding: "10px",
// //       backgroundColor: "#ff4d4d",
// //       color: "#fff",
// //       borderRadius: "5px",
// //       textAlign: "center",
// //     },
// //     modalOverlay: {
// //       position: "fixed",
// //       top: 0,
// //       bottom: 0,
// //       left: 0,
// //       right: 0,
// //       backgroundColor: "rgba(0, 0, 0, 0.6)",
// //       display: "flex",
// //       justifyContent: "center",
// //       alignItems: "center",
// //       zIndex: 9999,
// //     },
// //     modalContent: {
// //       backgroundColor: "#2a2a2a",
// //       padding: "20px",
// //       borderRadius: "10px",
// //       width: "90%",
// //       maxWidth: "500px",
// //       position: "relative",
// //     },
// //     closeButton: {
// //       position: "absolute",
// //       top: "10px",
// //       right: "10px",
// //       backgroundColor: "#555",
// //       color: "#fff",
// //       border: "none",
// //       borderRadius: "50%",
// //       width: "30px",
// //       height: "30px",
// //       cursor: "pointer",
// //       fontWeight: "bold",
// //     },
// //     modalImageContainer: {
// //       position: "relative",
// //       width: "100%",
// //       textAlign: "center",
// //       marginBottom: "20px",
// //     },
// //     modalImage: {
// //       maxWidth: "100%",
// //       maxHeight: "300px",
// //       borderRadius: "10px",
// //       objectFit: "cover",
// //     },
// //     penIconButton: {
// //       position: "absolute",
// //       top: "10px",
// //       right: "10px",
// //       backgroundColor: "#3f3f3f",
// //       border: "none",
// //       borderRadius: "50%",
// //       width: "40px",
// //       height: "40px",
// //       cursor: "pointer",
// //       display: "flex",
// //       justifyContent: "center",
// //       alignItems: "center",
// //       fontSize: "20px",
// //       color: "yellow",
// //     },
// //   };

// //   // Check if user has ADMIN role to render the dashboard
// //   if (role !== "ADMIN") {
// //     return (
      
// //       <div style={styles.container}>
// //         <div style={styles.headerContainer}>
// //           <h1 style={styles.headerTitle}>Access Denied</h1>
// //           <p style={{ color: "#fff" }}>ADMIN privileges required to access this page.</p>
// //           <button 
// //             onClick={() => navigate("/home")} 
// //             style={styles.submitButton}
// //           >
// //             Go Back
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (

// //     <div style={{
// //       backgroundColor: '#000',  // Dark background
// //       position: 'fixed',           // Covers entire viewport
// //       top: 0,
// //       left: 0,
// //       right: 0,
// //       bottom: 0,
// //       overflow: 'auto', 
// //     }}>
// //     <div style={styles.container}>
// //       <div style={styles.headerContainer}>
// //         <h1 style={styles.headerTitle}>Dashboard2</h1>
// //         <p style={{ color: "#b0b0b0" }}>ADMIN Access - Product Management</p>
// //       </div>

// //       {/* Top: Filter & Add Product */}
// //       <div style={styles.topSection}>
// //         {/* Search Container */}
// //         <div style={styles.filterContainer}>
// //           <h2 style={{ marginBottom: "10px", color: "#fff" }}>Search</h2>
// //           {/* Search by product name or brand */}
// //           <input
// //             type="text"
// //             placeholder="Search product/brand..."
// //             value={searchProductName}
// //             onChange={(e) => setSearchProductName(e.target.value)}
// //             style={styles.input}
// //           />

// //           {/* Search by Category text */}
// //           <input
// //             type="text"
// //             placeholder="Search by Category text..."
// //             value={searchCategoryText}
// //             onChange={(e) => setSearchCategoryText(e.target.value)}
// //             style={styles.input}
// //           />

// //           {/* Category dropdown (all categories from supabase) */}
// //           <select
// //             style={styles.dropdown}
// //             value={searchCategoryDropdown}
// //             onChange={(e) => setSearchCategoryDropdown(e.target.value)}
// //           >
// //             <option value="">All Categories</option>
// //             {allCategories.map((cat) => (
// //               <option key={cat.id} value={cat.category}>
// //                 {cat.category}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         {/* Add Product Container */}
// //         <div
// //           style={styles.addProductContainer}
// //           onDragOver={handleAddProductDragOver}
// //           onDrop={handleAddProductDrop}
// //         >
// //           <h2 style={{ marginBottom: "10px", color: "#fff" }}>Add New Product</h2>
// //           <form onSubmit={handleAddProduct}>
// //             {/* Product Name */}
// //             <input
// //               type="text"
// //               value={newProductName}
// //               onChange={(e) => setNewProductName(e.target.value)}
// //               style={styles.input}
// //               placeholder="Product Name"
// //               required
// //             />

// //             {/* Brand Name */}
// //             <input
// //               type="text"
// //               value={newBrand}
// //               onChange={(e) => setNewBrand(e.target.value)}
// //               style={styles.input}
// //               placeholder="Brand Name"
// //             />

// //             {/* Category Dropdown */}
// //             <select
// //               style={styles.dropdown2}
// //               value={newCat}
// //               onChange={(e) => setNewCat(e.target.value)}
// //             >
// //               <option value="">-- No Category --</option>
// //               {allCategories.map((cat) => (
// //                 <option key={cat.id} value={cat.category}>
// //                   {cat.category}
// //                 </option>
// //               ))}
// //             </select>

// //             {/* Description (information) */}
// //             <textarea
// //               value={newInformation}
// //               onChange={(e) => setNewInformation(e.target.value)}
// //               style={styles.textarea}
// //               placeholder="Product description..."
// //             />

// //             {/* Strength / Formulation / Size row */}
// //             <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
// //               {/* Strength (25%) */}
// //               <input
// //                 type="text"
// //                 value={newStrength}
// //                 onChange={(e) => setNewStrength(e.target.value)}
// //                 style={{ ...styles.input, width: "25%", marginBottom: 0 }}
// //                 placeholder="Strength"
// //               />
// //               {/* Formulation (40%) */}
// //               <select
// //                 style={{ ...styles.dropdown, width: "50%", marginBottom: 0 }}
// //                 value={newFormulation}
// //                 onChange={(e) => setNewFormulation(e.target.value)}
// //               >
// //                 <option value="">-- Formulation --</option>
// //                 {allFormulations.map((f) => (
// //                   <option key={f.id} value={f.formName}>
// //                     {f.formName}
// //                   </option>
// //                 ))}
// //               </select>
// //               {/* Size (25%) */}
// //               <input
// //                 type="text"
// //                 value={newSize}
// //                 onChange={(e) => setNewSize(e.target.value)}
// //                 style={{ ...styles.input, width: "25%", marginBottom: 0 }}
// //                 placeholder="Size"
// //               />
// //             </div>

// //             {/* Price (100%) */}
// //             <input
// //               type="text"
// //               value={newPrice}
// //               onChange={(e) => setNewPrice(e.target.value)}
// //               style={styles.input}
// //               placeholder="Price"
// //             />

// //             {/* File input (hidden) */}
// //             <input
// //               type="file"
// //               accept="image/*"
// //               id="product-image-input"
// //               style={{ display: "none" }}
// //               onChange={handleImageChange}
// //             />

// //             {/* Row: URL, Copy, Upload icons */}
// //             <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
// //               <input
// //                 type="text"
// //                 value={newProductImageUrl}
// //                 readOnly
// //                 style={{ ...styles.input2, marginBottom: 0 }}
// //                 placeholder="Image URL will appear here..."
// //               />
// //               {/* Copy button with icon */}
// //               <button
// //                 type="button"
// //                 onClick={handleCopy}
// //                 disabled={!newProductImageUrl}
// //                 style={{
// //                   backgroundColor: "#ccc",
// //                   border: "none",
// //                   borderRadius: "50%",
// //                   width: "34px",
// //                   height: "34px",
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 <img
// //                   src="src/assets/copy.png"
// //                   alt="Copy URL"
// //                   style={{ width: "24px", height: "24px" }}
// //                 />
// //               </button>
// //               {/* Upload button with icon */}
// //               <button
// //                 type="button"
// //                 onClick={() => document.getElementById("product-image-input")?.click()}
// //                 style={{
// //                   backgroundColor: "transparent",
// //                   border: "none",
// //                   borderRadius: "5px",
// //                   padding: "6px 10px",
// //                   cursor: "pointer",
// //                 }}
// //               >
// //                 <img
// //                   src="src/assets/upload.png"
// //                   alt="Upload"
// //                   style={{ width: "30px", height: "30px" }}
// //                 />
// //               </button>
// //             </div>

// //             {/* Preview image */}
// //             {newProductImageUrl && (
// //               <img src={newProductImageUrl} alt="Preview" style={{ width: "60px", height: "60px" }} />
// //             )}

// //             <button type="submit" style={styles.submitButton}>
// //               Add Product
// //             </button>
// //           </form>
// //         </div>
// //       </div>

// //       {/* Export ALL to Excel (CSV) */}
// //       <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-10px" }}>
// //         <button style={styles.exportAllButton} onClick={handleExportAllToExcel}>
// //           Export to Excel
// //         </button>
// //       </div>

// //       {/* Alert Modal */}
// //       {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />}

// //       {/*  Table(s) grouped by Category */}
// //       {Object.keys(groupedProducts).length === 0 ? (
// //         <p style={{ textAlign: "left", color: "#fff" }}>No products available.</p>
// //       ) : (
// //         Object.keys(groupedProducts).map((catName) => {
// //           const catProducts = groupedProducts[catName];

// //           return (
// //             <div key={catName} style={styles.tableContainer}>
// //               {/* Duplicate + Delete buttons (above each category header) */}
// //               <div
// //                 style={{
// //                   display: "flex",
// //                   justifyContent: "space-between",
// //                   alignItems: "center",
// //                   marginBottom: "10px",
// //                 }}
// //               >
// //                 <button
// //                   style={
// //                     selectedProductIds.length > 0
// //                       ? styles.activeDeleteButton
// //                       : styles.deleteButton
// //                   }
// //                   onClick={handleDeleteSelected}
// //                   disabled={selectedProductIds.length === 0}
// //                   aria-label="Delete Selected Products"
// //                 >
// //                   Delete Selected
// //                 </button>

// //                 <button
// //                   style={
// //                     selectedProductIds.length > 0
// //                       ? styles.activeDuplicateButton
// //                       : styles.inactiveDuplicateButton
// //                   }
// //                   onClick={handleDuplicateSelected}
// //                   disabled={selectedProductIds.length === 0}
// //                   aria-label="Duplicate Selected Products"
// //                 >
// //                   Duplicate
// //                 </button>
// //               </div>

// //               {/* Category Header (bold, left-aligned, white) */}
// //               <h2
// //                 style={{
// //                   marginBottom: "10px",
// //                   textAlign: "left",
// //                   fontWeight: "bold",
// //                   color: "#fff",
// //                 }}
// //               >
// //                 {catName === "No Category" ? "Uncategorized" : catName}
// //               </h2>

// //               <table style={styles.table}>
// //                 <thead>
// //                   <tr>
// //                     <th style={styles.th}>
// //                       <input
// //                         type="checkbox"
// //                         checked={isAllSelected}
// //                         onChange={handleSelectAll}
// //                         style={styles.checkbox}
// //                       />
// //                     </th>
// //                     <th style={styles.th}>Image</th>
// //                     <th style={styles.th}>Product Name</th>
// //                     <th style={styles.th}>Brand</th>
// //                     <th style={styles.th}>Strength</th>
// //                     <th style={styles.th}>Formulation</th>
// //                     <th style={styles.th}>Size</th>
// //                     <th style={styles.th}>Price</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {catProducts.map((product) => {
// //                     const isDraggingOver = draggingProductId === product.id;

// //                     return (
// //                       <tr key={product.id}>
// //                         {/* Checkbox */}
// //                         <td style={styles.td}>
// //                           <input
// //                             type="checkbox"
// //                             checked={selectedProductIds.includes(product.id)}
// //                             onChange={() => handleSelectRow(product.id)}
// //                             style={styles.checkbox}
// //                           />
// //                         </td>

// //                         {/* Image */}
// //                         <td style={styles.td}>
// //                           {editingCell?.id === product.id && editingCell.field === "productImage" ? (
// //                             <input
// //                               type="text"
// //                               value={editValue}
// //                               onChange={handleEditChange}
// //                               onBlur={handleEditSubmit}
// //                               onKeyDown={handleKeyDown}
// //                               autoFocus
// //                               style={styles.editInput}
// //                             />
// //                           ) : (
// //                             <div
// //                               style={styles.tableImageContainer}
// //                               onDragOver={(e) => handleTableImageDragOver(e, product.id)}
// //                               onDragLeave={handleTableImageDragLeave}
// //                               onDrop={(e) => {
// //                                 handleTableImageDrop(e, product);
// //                               }}
// //                               onPointerDown={() =>
// //                                 handlePointerDown(product.id, "productImage", product.productImage)
// //                               }
// //                               onPointerUp={handlePointerUpOrLeave}
// //                               onPointerLeave={handlePointerUpOrLeave}
// //                             >
// //                               <img
// //                                 src={
// //                                   product.productImage ||
// //                                   "https://cdn-icons-png.flaticon.com/512/7936/7936338.png"
// //                                 }
// //                                 alt={product.productName}
// //                                 style={{
// //                                   ...styles.tableImage,
// //                                   opacity: isDraggingOver ? 0.5 : 1,
// //                                 }}
// //                               />
// //                             </div>
// //                           )}
// //                         </td>

// //                         {/* Product Name (opens modal on click) */}
// //                         <td
// //                           style={styles.td}
// //                           onClick={() => handleProductNameClick(product)}
// //                           onPointerDown={() =>
// //                             handlePointerDown(product.id, "productName", product.productName)
// //                           }
// //                           onPointerUp={handlePointerUpOrLeave}
// //                           onPointerLeave={handlePointerUpOrLeave}
// //                         >
// //                           {editingCell?.id === product.id &&
// //                           editingCell.field === "productName" ? (
// //                             <input
// //                               type="text"
// //                               value={editValue}
// //                               onChange={handleEditChange}
// //                               onBlur={handleEditSubmit}
// //                               onKeyDown={handleKeyDown}
// //                               autoFocus
// //                               style={styles.editInput}
// //                             />
// //                           ) : (
// //                             product.productName
// //                           )}
// //                         </td>

// //                         {/* Brand */}
// //                         <td
// //                           style={styles.td}
// //                           onPointerDown={() =>
// //                             handlePointerDown(product.id, "brand", product.brand || "")
// //                           }
// //                           onPointerUp={handlePointerUpOrLeave}
// //                           onPointerLeave={handlePointerUpOrLeave}
// //                         >
// //                           {editingCell?.id === product.id && editingCell.field === "brand" ? (
// //                             <input
// //                               type="text"
// //                               value={editValue}
// //                               onChange={handleEditChange}
// //                               onBlur={handleEditSubmit}
// //                               onKeyDown={handleKeyDown}
// //                               autoFocus
// //                               style={styles.editInput}
// //                             />
// //                           ) : (
// //                             product.brand || ""
// //                           )}
// //                         </td>

// //                         {/* Strength */}
// //                         <td
// //                           style={styles.td}
// //                           onPointerDown={() =>
// //                             handlePointerDown(product.id, "strength", product.strength || "")
// //                           }
// //                           onPointerUp={handlePointerUpOrLeave}
// //                           onPointerLeave={handlePointerUpOrLeave}
// //                         >
// //                           {editingCell?.id === product.id && editingCell.field === "strength" ? (
// //                             <input
// //                               type="text"
// //                               value={editValue}
// //                               onChange={handleEditChange}
// //                               onBlur={handleEditSubmit}
// //                               onKeyDown={handleKeyDown}
// //                               autoFocus
// //                               style={styles.editInput}
// //                             />
// //                           ) : (
// //                             product.strength || ""
// //                           )}
// //                         </td>

// //                         {/* Formulation */}
// //                         <td
// //                           style={styles.td}
// //                           onPointerDown={() =>
// //                             handlePointerDown(product.id, "formulation", product.formulation || "")
// //                           }
// //                           onPointerUp={handlePointerUpOrLeave}
// //                           onPointerLeave={handlePointerUpOrLeave}
// //                         >
// //                           {editingCell?.id === product.id &&
// //                           editingCell.field === "formulation" ? (
// //                             <input
// //                               type="text"
// //                               value={editValue}
// //                               onChange={handleEditChange}
// //                               onBlur={handleEditSubmit}
// //                               onKeyDown={handleKeyDown}
// //                               autoFocus
// //                               style={styles.editInput}
// //                             />
// //                           ) : (
// //                             product.formulation || ""
// //                           )}
// //                         </td>

// //                         {/* Size */}
// //                         <td
// //                           style={styles.td}
// //                           onPointerDown={() =>
// //                             handlePointerDown(product.id, "size", product.size || "")
// //                           }
// //                           onPointerUp={handlePointerUpOrLeave}
// //                           onPointerLeave={handlePointerUpOrLeave}
// //                         >
// //                           {editingCell?.id === product.id && editingCell.field === "size" ? (
// //                             <input
// //                               type="text"
// //                               value={editValue}
// //                               onChange={handleEditChange}
// //                               onBlur={handleEditSubmit}
// //                               onKeyDown={handleKeyDown}
// //                               autoFocus
// //                               style={styles.editInput}
// //                             />
// //                           ) : (
// //                             product.size || ""
// //                           )}
// //                         </td>

// //                         {/* Price */}
// //                         <td
// //                           style={styles.td}
// //                           onPointerDown={() =>
// //                             handlePointerDown(product.id, "price", product.price || "")
// //                           }
// //                           onPointerUp={handlePointerUpOrLeave}
// //                           onPointerLeave={handlePointerUpOrLeave}
// //                         >
// //                           {editingCell?.id === product.id && editingCell.field === "price" ? (
// //                             <input
// //                               type="text"
// //                               value={editValue}
// //                               onChange={handleEditChange}
// //                               onBlur={handleEditSubmit}
// //                               onKeyDown={handleKeyDown}
// //                               autoFocus
// //                               style={styles.editInput}
// //                             />
// //                           ) : (
// //                             product.price || ""
// //                           )}
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           );
// //         })
// //       )}

// //       {/* Product Modal */}
// //       {showProductModal && selectedProduct && (
// //         <div style={styles.modalOverlay}>
// //           <div style={styles.modalContent}>
// //             <button
// //               style={styles.closeButton}
// //               onClick={() => setShowProductModal(false)}
// //             >
// //               X
// //             </button>

// //             {/* Category Dropdown at top */}
// //             <div style={{ marginBottom: "20px" }}>
// //               <select
// //                 style={styles.dropdown}
// //                 value={selectedProduct.cat || ""}
// //                 onChange={(e) => handleModalFieldChange("cat", e.target.value)}
// //               >
// //                 <option value="">-- No Category --</option>
// //                 {allCategories.map((cat) => (
// //                   <option key={cat.id} value={cat.category}>
// //                     {cat.category}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* Image with pen icon to upload a new one, plus drag-and-drop */}
// //             <div
// //               style={styles.modalImageContainer}
// //               onDragOver={handleModalDragOver}
// //               onDrop={handleModalDrop}
// //             >
// //               <img
// //                 src={
// //                   modalImageURL ||
// //                   "https://cdn-icons-png.flaticon.com/512/7936/7936338.png"
// //                 }
// //                 alt="Product"
// //                 style={styles.modalImage}
// //               />
// //               <button
// //                 style={styles.penIconButton}
// //                 onClick={() => {
// //                   const input = document.getElementById("modal-file-input");
// //                   if (input) input.click();
// //                 }}
// //               >
// //                 ✏️
// //               </button>
// //               <input
// //                 type="file"
// //                 accept="image/*"
// //                 id="modal-file-input"
// //                 style={{ display: "none" }}
// //                 onChange={handleModalImageChange}
// //               />
// //             </div>

// //             {/* Product Name */}
// //             <input
// //               type="text"
// //               value={selectedProduct.productName}
// //               onChange={(e) => handleModalFieldChange("productName", e.target.value)}
// //               style={styles.input}
// //             />

// //             {/* Brand */}
// //             <input
// //               type="text"
// //               value={selectedProduct.brand || ""}
// //               onChange={(e) => handleModalFieldChange("brand", e.target.value)}
// //               style={styles.input}
// //               placeholder="Brand"
// //             />

// //             {/* Description (information) */}
// //             <textarea
// //               value={selectedProduct.information}
// //               onChange={(e) => handleModalFieldChange("information", e.target.value)}
// //               style={styles.textarea}
// //             />

// //             <button
// //               style={{ ...styles.submitButton, marginTop: "10px" }}
// //               onClick={handleModalSave}
// //             >
// //               Save
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //     </div>
// //   );
// // }

// // export default Dashboardstore2;