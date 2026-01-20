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
 * The `brand` table structure:
 *  - id: string
 *  - brandName: string
 *  - brandImage: string
 */
interface Brand {
  id: string;
  brandName: string;
  brandImage: string;
}

function Dashboardstore() {
  const navigate = useNavigate();

  // Brands state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);

  // Editing logic
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Brand } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // Alert messages
  const [alertMessage, setAlertMessage] = useState<string>("");

  // Add Brand form
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandImageUrl, setNewBrandImageUrl] = useState("");

  // Search
  const [searchBrandName, setSearchBrandName] = useState("");

  // For long press
  const longPressRef = useRef<number | null>(null);

  // Modal
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [modalImageURL, setModalImageURL] = useState<string>("");

  // For image drag styling
  const [draggingBrandId, setDraggingBrandId] = useState<string | null>(null);

  // Selection
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

  // Column ordering state
  const [columnOrder, setColumnOrder] = useState<string[]>([
    "checkbox",
    "brandImage",
    "brandName",
    "actions"
  ]);

  // Dragging state for column reordering
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  /** ------------------------------------------------------------------
   *  1. On mount, fetch brands
   *  ------------------------------------------------------------------ */
  useEffect(() => {
    fetchAllBrands();
  }, []);

  const fetchAllBrands = async () => {
    try {
      const { data, error } = await supabase
        .from("brand")
        .select("id, brandName, brandImage")
        .order("id", { ascending: false }); // CHANGED: Order by ID descending
      if (error) throw error;
      if (data) {
        // Optional: Sort by brandName for display
        const sortedData = [...data].sort((a, b) => 
          a.brandName.localeCompare(b.brandName)
        );
        setBrands(sortedData as Brand[]);
        setFilteredBrands(sortedData as Brand[]);
      }
    } catch (error: any) {
      console.error("Error fetching brands:", error.message);
      setAlertMessage("Error fetching brands. Please try again.");
    }
  };
  /** ------------------------------------------------------------------
   *  2. Filter brands based on search
   *  ------------------------------------------------------------------ */
  useEffect(() => {
    if (!searchBrandName.trim()) {
      setFilteredBrands(brands);
    } else {
      const filtered = brands.filter(brand =>
        brand.brandName.toLowerCase().includes(searchBrandName.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchBrandName, brands]);

  /** ------------------------------------------------------------------
   *  3. Editing logic (long press)
   *  ------------------------------------------------------------------ */
  const handlePointerDown = (id: string, field: keyof Brand, currentValue: string) => {
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
      // Ensure ID is treated as string for comparison
      const { error } = await supabase
        .from("brand")
        .update({ [field]: editValue || null })
        .eq("id", id.toString()); // Convert to string for comparison
      if (error) throw error;
  
      setBrands((prev) =>
        prev.map((b) => (b.id.toString() === id.toString() ? { ...b, [field]: editValue || null } : b))
      );
      setFilteredBrands((prev) =>
        prev.map((b) => (b.id.toString() === id.toString() ? { ...b, [field]: editValue || null } : b))
      );
      
      setAlertMessage("Brand updated successfully!");
    } catch (err: any) {
      console.error("Error updating brand:", err.message);
      setAlertMessage(err.message || "Error updating brand. Please try again.");
    } finally {
      setEditingCell(null);
      setEditValue("");
    }
  };

  /** ------------------------------------------------------------------
   *  4. Add brand + image
   *  ------------------------------------------------------------------ */
  const handleAddBrand = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!newBrandName.trim()) {
        setAlertMessage("Please provide a brand name.");
        return;
      }

      // Check for duplicate brand name
      const { data: existingBrands } = await supabase
        .from("brand")
        .select("brandName")
        .eq("brandName", newBrandName.trim());

      if (existingBrands && existingBrands.length > 0) {
        setAlertMessage("Brand name already exists.");
        return;
      }

      const { error } = await supabase.from("brand").insert([
        {
          brandName: newBrandName.trim(),
          brandImage: newBrandImageUrl || "",
        },
      ]);
      if (error) throw error;

      setAlertMessage("New brand added successfully!");
      // Reset
      setNewBrandName("");
      setNewBrandImageUrl("");
      // Refresh
      fetchAllBrands();
    } catch (err: any) {
      console.error("Error adding brand:", err.message);
      setAlertMessage(err.message || "Error adding brand. Please try again.");
    }
  };

  // Drag Over / Drop for new brand
  const handleAddBrandDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAddBrandDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await doUploadFile(e.dataTransfer.files[0], "new", "brandImage");
    }
  };

  // Generic upload method for "new", "modal", or "table"
  const doUploadFile = async (file: File, mode: "new" | "modal" | "table", imageField: string = "brandImage", brand?: Brand) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;
  
      // CHANGE THIS LINE: Use "products" bucket instead of "brands"
      const { error: uploadError } = await supabase.storage
        .from("products")  // CHANGED FROM "brands" TO "products"
        .upload(filePath, file, { cacheControl: "3600", upsert: false });
      
      if (uploadError) throw uploadError;
  
      const { data } = supabase.storage.from("products").getPublicUrl(filePath); // CHANGED HERE TOO
      if (!data.publicUrl) throw new Error("Failed to get public URL.");
  
      if (mode === "new") {
        setNewBrandImageUrl(data.publicUrl);
      } else if (mode === "modal") {
        if (!selectedBrand) return;
        await supabase
          .from("brand")
          .update({ [imageField]: data.publicUrl })
          .eq("id", selectedBrand.id);
        
        setBrands((prev) =>
          prev.map((b) =>
            b.id === selectedBrand.id ? { ...b, [imageField]: data.publicUrl } : b
          )
        );
        setFilteredBrands((prev) =>
          prev.map((b) =>
            b.id === selectedBrand.id ? { ...b, [imageField]: data.publicUrl } : b
          )
        );
        if (imageField === "brandImage") {
          setModalImageURL(data.publicUrl);
        }
      } else if (mode === "table") {
        if (!brand) return;
        await supabase
          .from("brand")
          .update({ [imageField]: data.publicUrl })
          .eq("id", brand.id);
        
        setBrands((prev) =>
          prev.map((b) =>
            b.id === brand.id ? { ...b, [imageField]: data.publicUrl } : b
          )
        );
        setFilteredBrands((prev) =>
          prev.map((b) =>
            b.id === brand.id ? { ...b, [imageField]: data.publicUrl } : b
          )
        );
      }
    } catch (error: any) {
      console.error("Error uploading image:", error.message);
      setAlertMessage(error.message || "Error uploading image. Please try again.");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await doUploadFile(e.target.files[0], "new", "brandImage");
    }
  };

  const handleCopy = () => {
    if (newBrandImageUrl) {
      navigator.clipboard
        .writeText(newBrandImageUrl)
        .then(() => setAlertMessage("Image URL copied to clipboard!"))
        .catch(() => setAlertMessage("Failed to copy URL. Please try again."));
    } else {
      setAlertMessage("No URL to copy.");
    }
  };

  /** ------------------------------------------------------------------
   *  5. Delete selected
   *  ------------------------------------------------------------------ */
  const handleDeleteSelected = async () => {
    if (selectedBrandIds.length === 0) return;
    if (!window.confirm("Are you sure you want to delete the selected brands?")) return;
  
    try {
      // Ensure all IDs are properly formatted as strings for the IN clause
      const { error } = await supabase.from("brand").delete().in("id", selectedBrandIds.map(id => id.toString()));
      if (error) throw error;
      setSelectedBrandIds([]);
      fetchAllBrands();
      setAlertMessage("Brands deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting selected brands:", error.message);
      setAlertMessage(error.message || "Error deleting selected brands.");
    }
  };

  /** ------------------------------------------------------------------
   *  5b. DUPLICATE SELECTED
   *  ------------------------------------------------------------------ */
  const handleDuplicateSelected = async () => {
    if (selectedBrandIds.length === 0) return;
  
    try {
      // Gather selected brands
      const toDuplicate = brands.filter((b) => selectedBrandIds.includes(b.id));
      
      // Get the highest ID from the database
      const { data: maxIdData, error: maxIdError } = await supabase
        .from("brand")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);
        
      if (maxIdError) throw maxIdError;
      
      let nextId = 1;
      if (maxIdData && maxIdData[0] && maxIdData[0].id) {
        // Handle both string and numeric IDs
        const lastId = maxIdData[0].id;
        nextId = typeof lastId === 'number' ? lastId + 1 : parseInt(lastId.toString()) + 1;
      }
      
      const inserts = toDuplicate.map(brand => {
        const baseName = brand.brandName;
        let counter = 1;
        let newName = `${baseName} (Copy ${counter})`;
        
        while (brands.some(b => b.brandName === newName)) {
          counter++;
          newName = `${baseName} (Copy ${counter})`;
        }
        
        return {
          id: nextId++, // Use sequential ID
          brandName: newName,
          brandImage: brand.brandImage,
        };
      });
      
      const { error } = await supabase
        .from("brand")
        .insert(inserts);
        
      if (error) throw error;
      
      setAlertMessage("Brands duplicated successfully!");
      fetchAllBrands(); // Refresh
    } catch (err: any) {
      console.error("Error duplicating brands:", err.message);
      setAlertMessage(err.message || "Error duplicating brands. Please try again.");
    }
  };
  /** ------------------------------------------------------------------
   *  6. Brand Modal
   *  ------------------------------------------------------------------ */
  const handleBrandNameClick = (brand: Brand) => {
    setSelectedBrand(brand);
    setModalImageURL(brand.brandImage || "");
    setShowBrandModal(true);
  };

  const handleModalImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedBrand) return;
    if (e.target.files && e.target.files[0]) {
      await doUploadFile(e.target.files[0], "modal", "brandImage");
    }
  };

  const handleModalDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleModalDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!selectedBrand) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await doUploadFile(e.dataTransfer.files[0], "modal", "brandImage");
    }
  };

  const handleModalFieldChange = (field: keyof Brand, value: string) => {
    if (!selectedBrand) return;
    setSelectedBrand((prev) => (prev ? { ...prev, [field]: value || "" } : null));
  };

  const handleModalSave = async () => {
    if (!selectedBrand) return;
    try {
      const { id, brandName, brandImage } = selectedBrand;
      const { error } = await supabase
        .from("brand")
        .update({
          brandName,
          brandImage: modalImageURL,
        })
        .eq("id", id);
      if (error) throw error;

      // Update local
      setBrands((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, brandName, brandImage: modalImageURL } : b
        )
      );
      setFilteredBrands((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, brandName, brandImage: modalImageURL } : b
        )
      );
      setShowBrandModal(false);
      setAlertMessage("Brand updated successfully!");
    } catch (err: any) {
      console.error("Error saving brand changes:", err.message);
      setAlertMessage(err.message || "Error saving brand changes. Please try again.");
    }
  };

  /** ------------------------------------------------------------------
   *  7. Table image drag-n-drop
   *  ------------------------------------------------------------------ */
  function handleTableImageDragOver(e: DragEvent<HTMLDivElement>, brandId: string) {
    e.preventDefault();
    setDraggingBrandId(brandId);
  }
  
  function handleTableImageDragLeave() {
    setDraggingBrandId(null);
  }
  
  function handleTableImageDrop(e: DragEvent<HTMLDivElement>, brand: Brand) {
    e.preventDefault();
    setDraggingBrandId(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      doUploadFile(e.dataTransfer.files[0], "table", "brandImage", brand);
    }
  }

  /** ------------------------------------------------------------------
   *  8. Export ALL data to CSV
   *  ------------------------------------------------------------------ */
  const handleExportAllToExcel = () => {
    const headers = ["id", "brandName", "brandImage"];
    let csvContent = headers.join(",") + "\n";

    brands.forEach((b) => {
      const row = [
        b.id,
        b.brandName,
        b.brandImage,
      ];
      // Escape quotes
      const escaped = row.map((val) => `"${String(val).replace(/"/g, '""')}"`);
      csvContent += escaped.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Brands.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAlertMessage("Brands exported to CSV successfully!");
  };

  /** ------------------------------------------------------------------
   *  9. Selection logic
   *  ------------------------------------------------------------------ */
  const handleSelectRow = (id: string) => {
    if (selectedBrandIds.includes(id)) {
      setSelectedBrandIds(selectedBrandIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedBrandIds([...selectedBrandIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedBrandIds.length === filteredBrands.length && filteredBrands.length > 0) {
      setSelectedBrandIds([]);
    } else {
      setSelectedBrandIds(filteredBrands.map((b) => b.id));
    }
  };

  useEffect(() => {
    if (filteredBrands.length > 0 && filteredBrands.every((b) => selectedBrandIds.includes(b.id))) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [selectedBrandIds, filteredBrands]);

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
      marginLeft: "10px",
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
      height: "200px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    addBrandContainer: {
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
      marginRight: "10px",
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
      marginRight: "10px",
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
  const columnConfig: Record<string, { label: string; width: string; field?: keyof Brand }> = {
    checkbox: { label: "✓", width: "50px" },
    brandImage: { label: "Brand Image", width: "100px", field: "brandImage" },
    brandName: { label: "Brand Name", width: "70%", field: "brandName" },
    actions: { label: "Actions", width: "150px" },
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
          <h1 style={styles.headerTitle}>Brand Management Dashboard</h1>
          <p style={{ color: "#b0b0b0" }}>Manage Brand Names and Images</p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <button style={styles.exportAllButton} onClick={handleExportAllToExcel}>
              Export to Excel
            </button>
          </div>
        </div>

        {/* Top: Filter & Add Brand */}
        <div style={styles.topSection}>
          {/* Search Container */}
          <div style={styles.filterContainer}>
            <h2 style={{ marginBottom: "10px", color: "#fff" }}>Search Brands</h2>
            <input
              type="text"
              placeholder="Search brand name..."
              value={searchBrandName}
              onChange={(e) => setSearchBrandName(e.target.value)}
              style={styles.input}
            />
            <div style={{ marginTop: "auto" }}>
              <p style={{ fontSize: "14px", color: "#aaa" }}>
                Total Brands: {brands.length} | Showing: {filteredBrands.length}
              </p>
            </div>
          </div>

          {/* Add Brand Container */}
          <div
            style={styles.addBrandContainer}
            onDragOver={handleAddBrandDragOver}
            onDrop={handleAddBrandDrop}
          >
            <h2 style={{ marginBottom: "10px", color: "#fff" }}>Add New Brand</h2>
            <form onSubmit={handleAddBrand}>
              {/* Brand Name */}
              <input
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                style={styles.input}
                placeholder="Brand Name"
                required
              />

              {/* File input (hidden) */}
              <input
                type="file"
                accept="image/*"
                id="brand-image-input"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              {/* Row: URL, Copy, Upload icons */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <input
                  type="text"
                  value={newBrandImageUrl}
                  readOnly
                  style={{ ...styles.input2, marginBottom: 0 }}
                  placeholder="Brand Image URL will appear here..."
                />
                {/* Copy button with icon */}
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!newBrandImageUrl}
                  style={{
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    cursor: newBrandImageUrl ? "pointer" : "not-allowed",
                    opacity: newBrandImageUrl ? 1 : 0.5,
                  }}
                >
                  📋
                </button>
                {/* Upload button with icon */}
                <button
                  type="button"
                  onClick={() => document.getElementById("brand-image-input")?.click()}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "5px",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  📤
                </button>
              </div>

              {/* Preview image */}
              {newBrandImageUrl && (
                <img 
                  src={newBrandImageUrl} 
                  alt="Brand Preview" 
                  style={{ 
                    width: "80px", 
                    height: "80px", 
                    objectFit: "cover",
                    borderRadius: "5px",
                    marginBottom: "10px"
                  }} 
                />
              )}

              <button type="submit" style={styles.submitButton}>
                Add Brand
              </button>
            </form>
          </div>
        </div>

        {/* Alert Modal */}
        {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />}

        {/* Brands Table */}
        <div style={styles.tableContainer}>
          {/* Duplicate + Delete buttons */}
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
                selectedBrandIds.length > 0
                  ? styles.activeDeleteButton
                  : styles.deleteButton
              }
              onClick={handleDeleteSelected}
              disabled={selectedBrandIds.length === 0}
              aria-label="Delete Selected Brands"
            >
              Delete Selected
            </button>

            <button
              style={
                selectedBrandIds.length > 0
                  ? styles.activeDuplicateButton
                  : styles.inactiveDuplicateButton
              }
              onClick={handleDuplicateSelected}
              disabled={selectedBrandIds.length === 0}
              aria-label="Duplicate Selected Brands"
            >
              Duplicate
            </button>
          </div>

          {filteredBrands.length === 0 ? (
            <p style={{ textAlign: "center", color: "#fff", padding: "20px" }}>
              {searchBrandName ? "No brands match your search." : "No brands available. Add your first brand!"}
            </p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {columnOrder.map((columnId) => {
                    const config = columnConfig[columnId];
                    
                    return (
                      <th
                        key={columnId}
                        style={{ 
                          ...(draggedColumn === columnId ? styles.draggingTh : styles.th), 
                          width: config.width 
                        }}
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
                        {columnId === "checkbox" ? (
                          <input
                            type="checkbox"
                            checked={isAllSelected && filteredBrands.length > 0}
                            onChange={handleSelectAll}
                            style={styles.checkbox}
                          />
                        ) : (
                          config.label
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredBrands.map((brand) => {
                  const isDraggingOver = draggingBrandId === brand.id;

                  return (
                    <tr key={brand.id}>
                      {columnOrder.map((columnId) => {
                        const config = columnConfig[columnId];
                        
                        // Checkbox column
                        if (columnId === "checkbox") {
                          return (
                            <td key="checkbox" style={styles.td}>
                              <input
                                type="checkbox"
                                checked={selectedBrandIds.includes(brand.id)}
                                onChange={() => handleSelectRow(brand.id)}
                                style={styles.checkbox}
                              />
                            </td>
                          );
                        }

                        // Brand Image column
                        if (columnId === "brandImage") {
                          const imageUrl = brand.brandImage;
                          const isCurrentDragging = isDraggingOver;

                          return (
                            <td
                              key={columnId}
                              style={styles.td}
                              onDragOver={(e) => handleTableImageDragOver(e, brand.id)}
                              onDragLeave={handleTableImageDragLeave}
                              onDrop={(e) => handleTableImageDrop(e, brand)}
                              onPointerDown={() =>
                                handlePointerDown(brand.id, "brandImage", imageUrl || "")
                              }
                              onPointerUp={handlePointerUpOrLeave}
                              onPointerLeave={handlePointerUpOrLeave}
                            >
                              {editingCell?.id === brand.id && editingCell.field === "brandImage" ? (
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
                                <div style={styles.tableImageContainer}>
                                  <img
                                    src={
                                      imageUrl ||
                                      "https://cdn-icons-png.flaticon.com/512/7936/7936338.png"
                                    }
                                    alt={`${brand.brandName} logo`}
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

                        // Brand Name column
                        if (columnId === "brandName") {
                          return (
                            <td
                              key={columnId}
                              style={styles.td}
                              onClick={() => handleBrandNameClick(brand)}
                              onPointerDown={() =>
                                handlePointerDown(brand.id, "brandName", brand.brandName || "")
                              }
                              onPointerUp={handlePointerUpOrLeave}
                              onPointerLeave={handlePointerUpOrLeave}
                            >
                              {editingCell?.id === brand.id && editingCell.field === "brandName" ? (
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
                                <span style={{ color: "#3ecf8e", textDecoration: "underline", cursor: "pointer" }}>
                                  {brand.brandName}
                                </span>
                              )}
                            </td>
                          );
                        }

                        // Actions column
                        if (columnId === "actions") {
                          return (
                            <td key={columnId} style={styles.td}>
                              <button
                                onClick={() => handleBrandNameClick(brand)}
                                style={{
                                  backgroundColor: "#4CAF50",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "6px 12px",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                }}
                              >
                                Edit
                              </button>
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
          )}
        </div>

        {/* Brand Modal */}
        {showBrandModal && selectedBrand && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <button
                style={styles.closeButton}
                onClick={() => setShowBrandModal(false)}
              >
                X
              </button>

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
                  alt="Brand"
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

              {/* Brand Name */}
              <input
                type="text"
                value={selectedBrand.brandName}
                onChange={(e) => handleModalFieldChange("brandName", e.target.value)}
                style={styles.input}
                placeholder="Brand Name"
              />

              <button
                style={{ ...styles.submitButton, marginTop: "10px" }}
                onClick={handleModalSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboardstore;