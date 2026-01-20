

import React, {
    useState,
    useEffect,
    useRef,
    CSSProperties,
    DragEvent,
    ChangeEvent,
  } from "react";
  import supabase from "../../supabase";
  import { useNavigate } from "react-router-dom";
  
  interface Profile {
    role: string;
  }
  
  interface Category {
    id: string;
    categoryImage: string;
    category: string;
    catInfo: string;
  }
  
  function Dashboard3() {
    const navigate = useNavigate();
  
    // Profile / Role
    const [profile, setProfile] = useState<Profile | null>(null);
  
    // All categories from the "category" table
    const [categories, setCategories] = useState<Category[]>([]);
    // Filtered list for display
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  
    // Searching
    const [searchCategory, setSearchCategory] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Category[]>([]);
  
    // Dropdown filter
    const [dropdownCategoryFilter, setDropdownCategoryFilter] = useState<string>("");
  
    // Editing logic
    const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Category } | null>(
      null
    );
    const [editValue, setEditValue] = useState<string>("");
  
    // Adding a new category
    const [newCategoryImageFile, setNewCategoryImageFile] = useState<File | null>(null);
    const [newCategoryImageUrl, setNewCategoryImageUrl] = useState<string>("");
    const [newCategoryName, setNewCategoryName] = useState<string>("");
    const [newCategoryInfo, setNewCategoryInfo] = useState<string>("");
  
    // Long press ref for inline editing
    const longPressRef = useRef<number | null>(null);
  
    // Selected rows
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  
    // For drag styling in the table
    const [draggingCategoryId, setDraggingCategoryId] = useState<string | null>(null);
  
    /** ------------------------------------------------------------------
     *  1. On mount, fetch user info + categories
     *  ------------------------------------------------------------------ */
    useEffect(() => {
      fetchUserData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
    
        if (userError || !user) {
          throw new Error("User not authenticated.");
        }
    
        // Fetch role from 'profiles'
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
    
        if (profileError || !profileData) {
          throw new Error("Failed to retrieve profile information.");
        }
    
        // CHANGE THIS: Check for ADMIN role instead of pharmacy
        if (profileData.role !== "ADMIN") {
          navigate("/home");
          return;
        }
    
        setProfile(profileData);
        fetchAllCategories();
      } catch (error: any) {
        console.error("Error fetching user data:", error.message);
        navigate("/home");
      }
    };
    const fetchAllCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("category")
          .select("*")
          .order("category", { ascending: true });
  
        if (error) throw error;
  
        setCategories(data as Category[]);
        setFilteredCategories(data as Category[]);
        setSelectedCategoryIds([]);
        setIsAllSelected(false);
      } catch (error: any) {
        console.error("Error fetching categories:", error.message);
      }
    };
  
    /** ------------------------------------------------------------------
     *  2. Searching + Dropdown Filtering
     *  ------------------------------------------------------------------ */
    useEffect(() => {
      let temp = [...categories];
  
      // Search text
      if (searchCategory) {
        temp = temp.filter((cat) =>
          cat.category.toLowerCase().includes(searchCategory.toLowerCase())
        );
  
        // Build suggestions
        const matchedSuggestions = categories.filter((cat) =>
          cat.category.toLowerCase().includes(searchCategory.toLowerCase())
        );
        setSuggestions(matchedSuggestions);
      } else {
        setSuggestions([]);
      }
  
      // Dropdown filter
      if (dropdownCategoryFilter) {
        temp = temp.filter((cat) => cat.category === dropdownCategoryFilter);
      }
  
      setFilteredCategories(temp);
    }, [searchCategory, dropdownCategoryFilter, categories]);
  
    const handleSuggestionClick = (cat: Category) => {
      setSearchCategory(cat.category);
      setSuggestions([]);
    };
  
    /** ------------------------------------------------------------------
     *  3. Inline Editing
     *  ------------------------------------------------------------------ */
    const handleCellLongPress = (id: string, field: keyof Category, currentValue: string) => {
      setEditingCell({ id, field });
      setEditValue(currentValue);
    };
  
    const handleEditChange = (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
    ) => {
      setEditValue(e.target.value);
    };
  
    const handleEditSubmit = async () => {
      if (!editingCell) return;
      const { id, field } = editingCell;
  
      if (!editValue.trim()) {
        console.log("Field value cannot be empty.");
        return;
      }
  
      try {
        const updateData: Partial<Category> = { [field]: editValue };
        const { error } = await supabase.from("category").update(updateData).eq("id", id);
        if (error) throw error;
  
        // Update local state
        const updated = categories.map((c) =>
          c.id === id ? { ...c, [field]: editValue } : c
        );
        setCategories(updated);
  
        // Re-run filter logic
        let temp = [...updated];
        if (searchCategory) {
          temp = temp.filter((item) =>
            item.category.toLowerCase().includes(searchCategory.toLowerCase())
          );
        }
        if (dropdownCategoryFilter) {
          temp = temp.filter((cat) => cat.category === dropdownCategoryFilter);
        }
        setFilteredCategories(temp);
      } catch (err: any) {
        console.error("Error updating category:", err.message);
      } finally {
        setEditingCell(null);
        setEditValue("");
      }
    };
  
    // Long press pointer events
    const handlePointerDown = (id: string, field: keyof Category, currentValue: string) => {
      longPressRef.current = window.setTimeout(() => {
        handleCellLongPress(id, field, currentValue);
      }, 500);
    };
    const handlePointerUpOrLeave = () => {
      if (longPressRef.current) {
        clearTimeout(longPressRef.current);
        longPressRef.current = null;
      }
    };
  
    // Handle Enter key
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
    ) => {
      if (e.key === "Enter") handleEditSubmit();
    };
  
    /** ------------------------------------------------------------------
     *  4. Add New Category + Image
     *  ------------------------------------------------------------------ */
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        doUploadNewCategoryImage(e.target.files[0]);
      }
    };
  
    const doUploadNewCategoryImage = async (file: File) => {
      setNewCategoryImageFile(file);
      setNewCategoryImageUrl("");
  
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = fileName;
  
        // Upload to 'category' bucket
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) throw uploadError;
  
        // Get public URL
        const { data } = supabase.storage.from("products").getPublicUrl(filePath);
        if (!data.publicUrl) throw new Error("Failed to get public URL.");
  
        setNewCategoryImageUrl(data.publicUrl);
        console.log("Image uploaded successfully!");
      } catch (error: any) {
        console.error("Error uploading image:", error.message);
      }
    };
  
    // Copy to clipboard
    const handleCopy = () => {
      if (newCategoryImageUrl) {
        navigator.clipboard
          .writeText(newCategoryImageUrl)
          .then(() => console.log("Image URL copied to clipboard!"))
          .catch(() => console.log("Failed to copy URL."));
      } else {
        console.log("No URL to copy.");
      }
    };
  
    // Drag & Drop over "Add New Category" container
    const handleAddCategoryDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };
    const handleAddCategoryDrop = async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        doUploadNewCategoryImage(e.dataTransfer.files[0]);
      }
    };
  
    // Submit new category
    const handleAddCategory = async (e: React.FormEvent) => {
      e.preventDefault();
      // Basic validation
      if (!newCategoryName.trim() || !newCategoryInfo.trim() || !newCategoryImageUrl.trim()) {
        console.log("All fields are required.");
        return;
      }
      try {
        const { error } = await supabase.from("category").insert([
          {
            categoryImage: newCategoryImageUrl,
            category: newCategoryName,
            catInfo: newCategoryInfo,
          },
        ]);
        if (error) throw error;
  
        console.log("New category added successfully!");
        // Reset
        setNewCategoryImageFile(null);
        setNewCategoryImageUrl("");
        setNewCategoryName("");
        setNewCategoryInfo("");
  
        // Refresh
        fetchAllCategories();
      } catch (error: any) {
        console.error("Error adding new category:", error.message);
      }
    };
  
    /** ------------------------------------------------------------------
     *  5. Select / Delete
     *  ------------------------------------------------------------------ */
    const handleSelectRow = (id: string) => {
      if (selectedCategoryIds.includes(id)) {
        setSelectedCategoryIds(selectedCategoryIds.filter((selectedId) => selectedId !== id));
      } else {
        setSelectedCategoryIds([...selectedCategoryIds, id]);
      }
    };
  
    const handleSelectAll = () => {
      if (isAllSelected) {
        setSelectedCategoryIds([]);
        setIsAllSelected(false);
      } else {
        const allIds = filteredCategories.map((cat) => cat.id);
        setSelectedCategoryIds(allIds);
        setIsAllSelected(true);
      }
    };
  
    useEffect(() => {
      if (
        selectedCategoryIds.length === filteredCategories.length &&
        filteredCategories.length > 0
      ) {
        setIsAllSelected(true);
      } else {
        setIsAllSelected(false);
      }
    }, [selectedCategoryIds, filteredCategories]);
  
    const handleDeleteSelected = async () => {
      if (selectedCategoryIds.length === 0) return;
      // Just remove from DB (no alerts as requested)
      try {
        // Optionally, fetch images to delete from storage
        const { data: categoriesToDelete, error: fetchError } = await supabase
          .from("category")
          .select("id, categoryImage")
          .in("id", selectedCategoryIds);
  
        if (fetchError) throw fetchError;
  
        // Delete from DB
        const { error: deleteError } = await supabase
          .from("category")
          .delete()
          .in("id", selectedCategoryIds);
  
        if (deleteError) throw deleteError;
  
        // Delete images from storage
        for (const cat of categoriesToDelete as Category[]) {
          const imageUrl = cat.categoryImage;
          if (imageUrl) {
            const fileName = extractFilePath(imageUrl);
            const { error: storageError } = await supabase.storage
              .from("products")
              .remove([fileName]);
            if (storageError) {
              console.error(`Error deleting image ${imageUrl}:`, storageError.message);
            }
          }
        }
  
        console.log("Selected categories deleted successfully!");
        fetchAllCategories();
      } catch (error: any) {
        console.error("Error deleting selected categories:", error.message);
      }
    };
  
    // Extract file path from URL
    const extractFilePath = (url: string): string => {
      const parts = url.split("/");
      return parts.slice(-1)[0];
    };
  
    /** ------------------------------------------------------------------
     *  6. Drag & Drop in the Table (for updating categoryImage)
     *  ------------------------------------------------------------------ */
    const handleTableImageDragOver = (e: DragEvent<HTMLDivElement>, catId: string) => {
      e.preventDefault();
      setDraggingCategoryId(catId);
    };
  
    const handleTableImageDragLeave = () => {
      setDraggingCategoryId(null);
    };
  
    const handleTableImageDrop = (e: DragEvent<HTMLDivElement>, cat: Category) => {
      e.preventDefault();
      setDraggingCategoryId(null);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        doUploadTableFile(e.dataTransfer.files[0], cat.id);
      }
    };
  
    const doUploadTableFile = async (file: File, catId: string) => {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = fileName;
  
        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) throw uploadError;
  
        const { data } = supabase.storage.from("products").getPublicUrl(filePath);
        if (!data.publicUrl) throw new Error("Failed to get public URL.");
  
        // Update supabase
        const { error: updateError } = await supabase
          .from("category")
          .update({ categoryImage: data.publicUrl })
          .eq("id", catId);
        if (updateError) throw updateError;
  
        // Update local
        const updated = categories.map((c) =>
          c.id === catId ? { ...c, categoryImage: data.publicUrl } : c
        );
        setCategories(updated);
  
        // Re-filter
        let temp = [...updated];
        if (searchCategory) {
          temp = temp.filter((item) =>
            item.category.toLowerCase().includes(searchCategory.toLowerCase())
          );
        }
        if (dropdownCategoryFilter) {
          temp = temp.filter((cat) => cat.category === dropdownCategoryFilter);
        }
        setFilteredCategories(temp);
  
        console.log("Image updated in table!");
      } catch (error: any) {
        console.error("Error updating table image:", error.message);
      }
    };
  
    /** ------------------------------------------------------------------
     *  7. Styles
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
        fontWeight: 700,
        color: "#e0e0e0",
      },
      headerSubTitle: {
        fontSize: "24px",
        fontWeight: 600,
        color: "#b0b0b0",
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
      },
      addCategoryContainer: {
        backgroundColor: "#2a2a2a",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 12px 1px #000",
        flex: "1",
        minWidth: "280px",
        // Handle drag over for image upload
      },
      filterHeader: {
        fontSize: "22px",
        fontWeight: "600",
        marginBottom: "10px",
        color: "#fff",
        textAlign: "center",
      },
      formGroup: {
        marginBottom: "15px",
        display: "flex",
        flexDirection: "column",
      },
      searchInput: {
        backgroundColor: "#555",
        color: "#fff",
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #555",
        borderRadius: "5px",
        outline: "none",
        width: "100%",
        transition: "border-color 0.3s ease",
      },
      suggestionsList: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "#2a2a2a",
        border: "1px solid #555",
        borderRadius: "5px",
        zIndex: 1000,
        maxHeight: "200px",
        overflowY: "auto",
      },
      suggestionItem: {
        padding: "10px",
        cursor: "pointer",
        borderBottom: "1px solid #555",
        transition: "background-color 0.3s",
      },
      tableContainer: {
        marginTop: "40px",
        overflowX: "auto",
        borderRadius: "10px",
        backgroundColor: "#1e1e1e",
        padding: "12px",
        position: "relative",
      },
      table: {
        width: "100%",
        borderCollapse: "collapse",
        color: "#fff",
        fontSize: "16px",
        marginBottom: "20px",
        minWidth: "700px",
      },
      th: {
        border: "1px solid #555",
        textAlign: "center",
        padding: "10px",
        backgroundColor: "#3ecf8e",
        color: "#000",
        fontSize: "18px",
      },
      td: {
        border: "1px solid #555",
        textAlign: "center",
        padding: "10px",
        color: "#fff",
        cursor: "pointer",
        position: "relative",
        verticalAlign: "middle",
      },
      // Input / Textarea for editing
      editInput: {
        backgroundColor: "#555",
        color: "#fff",
        border: "1px solid #555",
        borderRadius: "5px",
        padding: "5px",
        fontSize: "16px",
        outline: "none",
        width: "100%",
      },
      submitButton: {
        backgroundColor: "#3ecf8e",
        color: "#000",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "10px",
        width: "100%", // FULL width as requested
      },
      // For the upload button + copy button (similar to Dashboard2)
      flexRow: {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      },
      inputContainer: {
        position: "relative",
        flexBasis: "80%",
      },
      urlInput: {
        backgroundColor: "#555",
        color: "#fff",
        border: "1px solid #555",
        borderRadius: "5px",
        outline: "none",
        padding: "10px",
        fontSize: "16px",
        width: "103%",
        marginBottom: "7px",
        transition: "border-color 0.3s ease",
        paddingRight: "45px", // space for copy button
      },
      copyButton: {
        position: "absolute",
        right: "-2px",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "transparent",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        width: "35px",
        height: "35px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      copyButtonIcon: {
        width: "24px",
        height: "24px",
      },
      uploadButton: {
        backgroundColor: "transparent",
        borderRadius: "4px",
        border: "none",
        cursor: "pointer",
        height: "45px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px 1px #007BA7",
        flexBasis: "15%",
        marginBottom: "6px"
      },
      imagePreview: {
        width: "60px",
        height: "60px",
        objectFit: "cover",
        borderRadius: "5px",
        marginTop: "10px",
      },
      deleteButton: {
        backgroundColor: "red", // Default gray
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        padding: "10px 20px",
        cursor: "not-allowed",
        marginBottom: "10px",
        display: "inline-block",
        opacity: 0.4,
        transition: "background-color 0.3s, opacity 0.3s, cursor 0.3s",
      },
      activeDeleteButton: {
        backgroundColor: "red",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        padding: "10px 20px",
        cursor: "pointer",
        marginBottom: "10px",
        display: "inline-block",
        opacity: 1,
        transition: "background-color 0.3s, opacity 0.3s, cursor 0.3s",
      },
      checkbox: {
        width: "20px",
        height: "20px",
        cursor: "pointer",
      },
      textarea: {
        backgroundColor: "#555",
        color: "#fff",
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #555",
        borderRadius: "5px",
        outline: "none",
        width: "100%",
        height: "100px",
        resize: "vertical",
      },
    };
   // Add this near the top of the return statement, after the styles definition:
if (profile?.role !== "ADMIN") {
  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.headerTitle}>Access Denied</h1>
        <p style={{ color: "#fff" }}>ADMIN privileges required to access this page.</p>
        <button 
          onClick={() => navigate("/home")} 
          style={styles.submitButton}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
    return (
      <div style={{
        backgroundColor: '#000',  // Dark background
        position: 'fixed',           // Covers entire viewport
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto', 
      }}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.headerContainer}>
          <h1 style={styles.headerTitle}>Dashboard3</h1>
          <p style={styles.headerSubTitle}>Role: {profile?.role}</p>
        </div>
  
        {/* Top Section: Filter & Add Category */}
        <div style={styles.topSection}>
          {/* Filter Container */}
          <div style={styles.filterContainer}>
            <h2 style={styles.filterHeader}>Filters</h2>
            {/* Search by Category Name */}
            <div style={styles.formGroup}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  style={styles.searchInput}
                  placeholder="Search Category Name..."
                  onBlur={() => {
                    setTimeout(() => setSuggestions([]), 100);
                  }}
                  aria-label="Search Category Name"
                />
                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div style={styles.suggestionsList}>
                    {suggestions.map((cat) => (
                      <div
                        key={cat.id}
                        style={styles.suggestionItem}
                        onClick={() => handleSuggestionClick(cat)}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#3ecf8e")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#2a2a2a")
                        }
                      >
                        {cat.category}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
  
            {/* Dropdown Filter */}
            <div style={styles.formGroup}>
              <select
                style={styles.searchInput}
                value={dropdownCategoryFilter}
                onChange={(e) => setDropdownCategoryFilter(e.target.value)}
                aria-label="Filter by Category"
              >
                <option value="" disabled>
                  -- Select Category --
                </option>
                <option value="">-- All Categories --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          {/* Add New Category Container */}
          <div
            style={styles.addCategoryContainer}
            onDragOver={handleAddCategoryDragOver}
            onDrop={handleAddCategoryDrop}
          >
            <h2 style={styles.filterHeader}>Add New Category</h2>
            <form onSubmit={handleAddCategory}>
              {/* Hidden file input for images */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="category-image-input"
              />
  
              {/* URL input + copy button + upload button */}
              <div style={styles.flexRow}>
                {/* Left side: URL input + copy button */}
                <div style={styles.inputContainer}>
                  <input
                    type="text"
                    value={newCategoryImageUrl}
                    readOnly
                    style={styles.urlInput}
                    placeholder="Image URL will appear here..."
                    aria-label="Category Image URL"
                  />
                  <button
                    type="button"
                    style={styles.copyButton}
                    onClick={handleCopy}
                    disabled={!newCategoryImageUrl}
                    title="Copy to clipboard"
                    aria-label="Copy Image URL"
                  >
                    <img
                      src="src/assets/copy.png"
                      alt="Copy URL"
                      style={styles.copyButtonIcon}
                    />
                  </button>
                </div>
  
                {/* Right side: Upload button */}
                <button
                  type="button"
                  style={styles.uploadButton}
                  onClick={() => document.getElementById("category-image-input")?.click()}
                  aria-label="Upload Image"
                >
                  <img
                    src="src/assets/upload.png"
                    alt="Upload"
                    style={{ width: "24px", height: "24px" }}
                  />
                </button>
              </div>
  
              {/* Preview if exists */}
              {newCategoryImageUrl && (
                <img src={newCategoryImageUrl} alt="Preview" style={styles.imagePreview} />
              )}
  
              {/* Category Name (100% width) */}
              <div style={styles.formGroup}>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  style={styles.searchInput}
                  placeholder="Enter Category Name..."
                  aria-label="Category Name"
                />
              </div>
  
              {/* Category Info (100% width) */}
              <div style={styles.formGroup}>
                <textarea
                  value={newCategoryInfo}
                  onChange={(e) => setNewCategoryInfo(e.target.value)}
                  style={styles.textarea}
                  placeholder="Enter Information..."
                  aria-label="Category Information"
                />
              </div>
  
              {/* Add Category Button (100% width) */}
              <button
                type="submit"
                style={{ ...styles.submitButton, width: "100%" }}
                disabled={!newCategoryImageUrl}
                aria-label="Add Category"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>
  
        {/* Category Table */}
        <div style={styles.tableContainer}>
          {/* Delete Selected Button */}
          <button
            style={
              selectedCategoryIds.length > 0
                ? styles.activeDeleteButton
                : styles.deleteButton
            }
            onClick={handleDeleteSelected}
            disabled={selectedCategoryIds.length === 0}
            aria-label="Delete Selected Categories"
          >
            Delete Selected
          </button>
  
          {filteredCategories.length === 0 ? (
            <p style={{ textAlign: "center", color: "#fff" }}>No categories available.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      style={styles.checkbox}
                      aria-label="Select All Categories"
                    />
                  </th>
                  <th style={styles.th}>Image</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Information</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => {
                  const isDraggingOver = draggingCategoryId === cat.id;
  
                  return (
                    <tr key={cat.id}>
                      {/* Checkbox selection */}
                      <td style={styles.td}>
                        <input
                          type="checkbox"
                          checked={selectedCategoryIds.includes(cat.id)}
                          onChange={() => handleSelectRow(cat.id)}
                          style={styles.checkbox}
                          aria-label={`Select category ${cat.category}`}
                        />
                      </td>
  
                      {/* Category Image (drag & drop) */}
                      <td style={styles.td}>
                        {editingCell?.id === cat.id && editingCell.field === "categoryImage" ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={handleEditChange}
                            onBlur={handleEditSubmit}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            style={styles.editInput}
                            placeholder="Enter Image URL..."
                            aria-label="Edit Category Image URL"
                          />
                        ) : (
                          <div
                            style={{
                              position: "relative",
                              width: "60px",
                              height: "60px",
                              margin: "0 auto",
                              borderRadius: "5px",
                              overflow: "hidden",
                            }}
                            onDragOver={(e) => handleTableImageDragOver(e, cat.id)}
                            onDragLeave={handleTableImageDragLeave}
                            onDrop={(e) => handleTableImageDrop(e, cat)}
                            onPointerDown={() =>
                              handlePointerDown(cat.id, "categoryImage", cat.categoryImage)
                            }
                            onPointerUp={handlePointerUpOrLeave}
                            onPointerLeave={handlePointerUpOrLeave}
                            aria-label={`Category Image for ${cat.category}`}
                          >
                            <img
                              src={
                                cat.categoryImage ||
                                "https://cdn-icons-png.flaticon.com/512/7936/7936338.png"
                              }
                              alt={cat.category}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                opacity: isDraggingOver ? 0.5 : 1,
                                transition: "opacity 0.2s",
                              }}
                            />
                          </div>
                        )}
                      </td>
  
                      {/* Category Name */}
                      <td
                        style={styles.td}
                        onPointerDown={() => handlePointerDown(cat.id, "category", cat.category)}
                        onPointerUp={handlePointerUpOrLeave}
                        onPointerLeave={handlePointerUpOrLeave}
                        aria-label={`Category Name: ${cat.category}`}
                      >
                        {editingCell?.id === cat.id && editingCell.field === "category" ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={handleEditChange}
                            onBlur={handleEditSubmit}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            style={styles.editInput}
                            placeholder="Enter Category Name..."
                            aria-label="Edit Category Name"
                          />
                        ) : (
                          cat.category
                        )}
                      </td>
  
                      {/* Category Info */}
                      <td
                        style={{ ...styles.td, textAlign: "left" }}
                        onPointerDown={() => handlePointerDown(cat.id, "catInfo", cat.catInfo)}
                        onPointerUp={handlePointerUpOrLeave}
                        onPointerLeave={handlePointerUpOrLeave}
                        aria-label={`Category Information: ${cat.catInfo}`}
                      >
                        {editingCell?.id === cat.id && editingCell.field === "catInfo" ? (
                          <textarea
                            value={editValue}
                            onChange={handleEditChange}
                            onBlur={handleEditSubmit}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            style={styles.editInput}
                            placeholder="Enter Information..."
                            aria-label="Edit Category Information"
                          />
                        ) : (
                          cat.catInfo
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>
    );
  }
  
  export default Dashboard3;
  
  // import React, { useState, useEffect, useRef, CSSProperties } from "react";
  // import supabase from "../../supabase";
  // import { useNavigate } from "react-router-dom";
  
  // interface Profile {
  //   pharmacy: string;
  //   role: string;
  // }
  
  // interface Category {
  //   id: string;
  //   categoryImage: string;
  //   category: string;
  //   catInfo: string;
  //   pharmacy: string;
  // }
  
  // function Dashboard3() {
  //   const navigate = useNavigate();
  
  //   // State Variables
  //   const [profile, setProfile] = useState<Profile | null>(null);
  //   const [categories, setCategories] = useState<Category[]>([]);
  //   const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  //   const [categoryNames, setCategoryNames] = useState<string[]>([]);
  
  //   // Filters
  //   const [searchCategory, setSearchCategory] = useState<string>("");
  //   const [suggestions, setSuggestions] = useState<Category[]>([]); // Added suggestions state
  
  //   // Editing
  //   const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  //   const [editValue, setEditValue] = useState<string>("");
  
  //   // Add New Category State Variables
  //   const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  //   const [newCategoryImageUrl, setNewCategoryImageUrl] = useState<string>("");
  //   const [newCategoryName, setNewCategoryName] = useState<string>("");
  //   const [newCategoryInfo, setNewCategoryInfo] = useState<string>("");
  
  //   // Ref for handling long press
  //   const longPressRef = useRef<number | null>(null);
  
  //   // Fetch User Data on Mount
  //   useEffect(() => {
  //     fetchUserData();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);
  
  //   // Fetch User Profile
  //   const fetchUserData = async () => {
  //     try {
  //       const {
  //         data: { user },
  //         error: userError,
  //       } = await supabase.auth.getUser();
  
  //       if (userError || !user) {
  //         throw new Error("User not authenticated.");
  //       }
  
  //       const { data: profileData, error: profileError } = await supabase
  //         .from("profiles")
  //         .select("pharmacy, role")
  //         .eq("id", user.id)
  //         .single();
  
  //       if (profileError || !profileData) {
  //         throw new Error("Failed to retrieve profile information.");
  //       }
  
  //       if (profileData.role !== "PHARMACY") {
  //         navigate("/home");
  //         return;
  //       }
  
  //       setProfile(profileData);
  //       fetchInitialData(profileData.pharmacy);
  //     } catch (error: any) {
  //       console.error("Error fetching user data:", error.message);
  //       window.alert("Error fetching user information. Please try again.");
  //       navigate("/home");
  //     }
  //   };
  
  //   // Fetch Initial Data
  //   const fetchInitialData = async (pharmacy: string) => {
  //     try {
  //       // Fetch Categories from 'category' table where pharmacy matches
  //       const { data, error } = await supabase
  //         .from("category")
  //         .select("*")
  //         .eq("pharmacy", pharmacy)
  //         .order("category", { ascending: true });
  
  //       if (error) throw error;
  
  //       setCategories(data as Category[]);
  //       setFilteredCategories(data as Category[]);
  //       extractUniqueCategoryNames(data as Category[]);
  //     } catch (error: any) {
  //       console.error("Error fetching initial data:", error.message);
  //       window.alert("Error fetching initial data. Please try again.");
  //     }
  //   };
  
  //   // Extract Unique Category Names for Potential Future Use
  //   const extractUniqueCategoryNames = (categoriesList: Category[]) => {
  //     const categorySet = new Set<string>();
  //     categoriesList.forEach((category) => {
  //       if (category.category) categorySet.add(category.category);
  //     });
  //     setCategoryNames(Array.from(categorySet).sort());
  //   };
  
  //   // Handle Filtering and Searching
  //   useEffect(() => {
  //     let tempCategories = [...categories];
  
  //     // Search by Category Name
  //     if (searchCategory) {
  //       tempCategories = tempCategories.filter((category) =>
  //         category.category.toLowerCase().includes(searchCategory.toLowerCase())
  //       );
  
  //       // Fetch suggestions based on search input
  //       const matchedSuggestions = categories.filter((category) =>
  //         category.category.toLowerCase().includes(searchCategory.toLowerCase())
  //       );
  //       setSuggestions(matchedSuggestions);
  //     } else {
  //       setSuggestions([]);
  //     }
  
  //     setFilteredCategories(tempCategories);
  //     extractUniqueCategoryNames(tempCategories);
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [searchCategory, categories]);
  
  //   const handleSuggestionClick = (category: Category) => {
  //     setSearchCategory(category.category);
  //     setSuggestions([]);
  //   };
  
  //   // Handle Inline Editing
  //   const handleCellLongPress = (id: string, field: string, currentValue: string) => {
  //     setEditingCell({ id, field });
  //     setEditValue(currentValue);
  //   };
  
  //   const handleEditChange = (
  //     e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  //   ) => {
  //     setEditValue(e.target.value);
  //   };
  
  //   const handleEditSubmit = async () => {
  //     if (!editingCell) return;
  //     const { id, field } = editingCell;
  
  //     // Validate inputs
  //     if (!editValue.trim()) {
  //       window.alert("Field value cannot be empty.");
  //       return;
  //     }
  
  //     try {
  //       // Update the category in the database
  //       const updateData: Partial<Category> = { [field]: editValue };
  //       const { error } = await supabase.from("category").update(updateData).eq("id", id);
  
  //       if (error) throw error;
  
  //       // Update local state
  //       const updatedCategories = categories.map((category) =>
  //         category.id === id ? { ...category, [field]: editValue } : category
  //       );
  //       setCategories(updatedCategories);
  //       setFilteredCategories(updatedCategories);
  //       extractUniqueCategoryNames(updatedCategories);
  
  //       window.alert("Category updated successfully!");
  //     } catch (error: any) {
  //       console.error("Error updating category:", error.message);
  //       window.alert(error.message || "Error updating category. Please try again.");
  //     } finally {
  //       setEditingCell(null);
  //       setEditValue("");
  //     }
  //   };
  
  //   // Handle Pointer Events for Long Press
  //   const handlePointerDown = (id: string, field: string, currentValue: string) => {
  //     longPressRef.current = window.setTimeout(() => {
  //       handleCellLongPress(id, field, currentValue);
  //     }, 500); // 500ms for long press
  //   };
  
  //   const handlePointerUpOrLeave = () => {
  //     if (longPressRef.current) {
  //       clearTimeout(longPressRef.current);
  //       longPressRef.current = null;
  //     }
  //   };
  
  //   // Handle Enter Key in Editing
  //   const handleKeyDown = (
  //     e: React.KeyboardEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  //   ) => {
  //     if (e.key === "Enter") {
  //       handleEditSubmit();
  //     }
  //   };
  
  //   // Handle Image Upload Automatically on Selection
  //   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files && e.target.files[0]) {
  //       const file = e.target.files[0];
  //       setNewCategoryImage(file);
  //       setNewCategoryImageUrl("");
  
  //       try {
  //         const fileExt = file.name.split(".").pop();
  //         const fileName = `${Date.now()}.${fileExt}`;
  //         const filePath = `${fileName}`;
  
  //         // Upload the image to the 'category' bucket
  //         const { error: uploadError } = await supabase.storage.from("category").upload(filePath, file, {
  //           cacheControl: "3600",
  //           upsert: false,
  //         });
  
  //         if (uploadError) {
  //           throw uploadError;
  //         }
  
  //         // Get the public URL of the uploaded image
  //         const { data } = supabase.storage.from("category").getPublicUrl(filePath);
  
  //         if (!data.publicUrl) {
  //           throw new Error("Failed to get public URL for the uploaded image.");
  //         }
  
  //         setNewCategoryImageUrl(data.publicUrl);
  //         window.alert("Image uploaded successfully!");
  //       } catch (error: any) {
  //         console.error("Error uploading image:", error.message);
  //         window.alert(error.message || "Error uploading image. Please try again.");
  //       }
  //     }
  //   };
  
  //   // Handle Copy to Clipboard
  //   const handleCopy = () => {
  //     if (newCategoryImageUrl) {
  //       navigator.clipboard
  //         .writeText(newCategoryImageUrl)
  //         .then(() => window.alert("Image URL copied to clipboard!"))
  //         .catch(() => window.alert("Failed to copy URL. Please try again."));
  //     } else {
  //       window.alert("No URL to copy.");
  //     }
  //   };
  
  //   // Styles
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
  //     headerSubTitle: {
  //       fontSize: "24px",
  //       fontWeight: "600",
  //       color: "#b0b0b0",
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
  //     },
  //     addCategoryContainer: {
  //       backgroundColor: "#2a2a2a",
  //       padding: "20px",
  //       borderRadius: "10px",
  //       boxShadow: "0 2px 12px 1px #000",
  //       flex: "1",
  //       minWidth: "280px",
  //     },
  //     filterHeader: {
  //       fontSize: "22px",
  //       fontWeight: "600",
  //       marginBottom: "10px",
  //       color: "#fff",
  //       textAlign: "center",
  //     },
  //     formGroup: {
  //       marginBottom: "15px",
  //       display: "flex",
  //       flexDirection: "column",
  //     },
  //     label: {
  //       marginBottom: "5px",
  //       fontWeight: "500",
  //       color: "#fff",
  //     },
  //     input: {
  //       backgroundColor: "#555",
  //       color: "#fff",
  //       padding: "10px",
  //       fontSize: "16px",
  //       border: "1px solid #555",
  //       borderRadius: "5px",
  //       outline: "none",
  //       transition: "border-color 0.3s ease",
  //     },
  //     textarea: {
  //       backgroundColor: "#555",
  //       color: "#fff",
  //       padding: "10px",
  //       fontSize: "16px",
  //       border: "1px solid #555",
  //       borderRadius: "5px",
  //       outline: "none",
  //       width: "100%",
  //       height: "100px",
  //       resize: "vertical",
  //     },
  //     searchContainer: {
  //       marginTop: "10px",
  //       position: "relative",
  //     },
  //     searchInput: {
  //       backgroundColor: "#555",
  //       color: "#fff",
  //       padding: "10px",
  //       fontSize: "16px",
  //       border: "1px solid #555",
  //       borderRadius: "5px",
  //       outline: "none",
  //       width: "100%",
  //     },
  //     suggestionsList: {
  //       position: "absolute",
  //       top: "100%",
  //       left: 0,
  //       right: 0,
  //       backgroundColor: "#2a2a2a",
  //       border: "1px solid #555",
  //       borderRadius: "5px",
  //       zIndex: 1000,
  //       maxHeight: "200px",
  //       overflowY: "auto",
  //     },
  //     suggestionItem: {
  //       padding: "10px",
  //       cursor: "pointer",
  //       borderBottom: "1px solid #555",
  //       transition: "background-color 0.3s",
  //     },
  //     tableContainer: {
  //       marginTop: "50px",
  //       overflowX: "auto",
  //       borderRadius: "10px",
  //       boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  //       backgroundColor: "#1e1e1e",
  //       padding: "12px",
  //     },
  //     table: {
  //       width: "100%",
  //       borderCollapse: "collapse",
  //       minWidth: "800px",
  //       color: "#fff",
  //       fontSize: "16px",
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
  //     },
  //     submitButton: {
  //       backgroundColor: "#3ecf8e",
  //       color: "#000",
  //       padding: "10px 20px",
  //       border: "none",
  //       borderRadius: "5px",
  //       fontSize: "16px",
  //       cursor: "pointer",
  //       marginTop: "10px",
  //       transition: "background-color 0.3s",
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "center",
  //     },
  //     uploadButton: {
  //       backgroundColor: "#007BA7",
  //       color: "#fff",
  //       padding: "10px 20px",
  //       border: "none",
  //       borderRadius: "5px",
  //       fontSize: "16px",
  //       cursor: "pointer",
  //       marginRight: "10px",
  //       transition: "background-color 0.3s",
  //     },
  //     copyButton: {
  //       backgroundColor: "#28a745",
  //       color: "#fff",
  //       padding: "10px 20px",
  //       border: "none",
  //       borderRadius: "5px",
  //       fontSize: "16px",
  //       cursor: "pointer",
  //       transition: "background-color 0.3s",
  //       marginTop: "10px",
  //     },
  //     imagePreview: {
  //       width: "100px",
  //       height: "100px",
  //       objectFit: "cover",
  //       borderRadius: "5px",
  //       marginTop: "10px",
  //     },
  //   };
  
  //   return (
  //     <div style={styles.container}>
  //       {/* Header */}
  //       <div style={styles.headerContainer}>
  //         <h1 style={styles.headerTitle}>Dashboard3</h1>
  //         <p style={styles.headerSubTitle}>{profile?.pharmacy}</p>
  //       </div>
  
  //       {/* Top Section: Filters and Add New Category */}
  //       <div style={styles.topSection}>
  //         {/* Filter Container */}
  //         <div style={styles.filterContainer}>
  //           <h2 style={styles.filterHeader}>Filters</h2>
  //           {/* Search by Category Name */}
  //           <div style={styles.formGroup}>
  //             <label style={styles.label}>Search by Category</label>
  //             <div style={styles.searchContainer}>
  //               <input
  //                 type="text"
  //                 value={searchCategory}
  //                 onChange={(e) => setSearchCategory(e.target.value)}
  //                 style={styles.searchInput}
  //                 placeholder="Enter Category Name..."
  //                 onFocus={() => {
  //                   if (searchCategory) {
  //                     // Optionally, fetch suggestions here
  //                   }
  //                 }}
  //                 onBlur={() => {
  //                   // Delay to allow click on suggestion
  //                   setTimeout(() => setSuggestions([]), 100);
  //                 }}
  //               />
  //               {suggestions.length > 0 && (
  //                 <div style={styles.suggestionsList}>
  //                   {suggestions.map((category) => (
  //                     <div
  //                       key={category.id}
  //                       style={styles.suggestionItem}
  //                       onClick={() => handleSuggestionClick(category)}
  //                       onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3ecf8e")}
  //                       onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2a2a2a")}
  //                     >
  //                       {category.category}
  //                     </div>
  //                   ))}
  //                 </div>
  //               )}
  //             </div>
  //           </div>
  //         </div>
  
  //         {/* Add New Category Container */}
  //         <div style={styles.addCategoryContainer}>
  //           <h2 style={styles.filterHeader}>Add New Category</h2>
  //           <form
  //             onSubmit={async (e) => {
  //               e.preventDefault();
  //               try {
  //                 // Validate all fields
  //                 if (
  //                   !newCategoryName.trim() ||
  //                   !newCategoryInfo.trim() ||
  //                   !newCategoryImageUrl.trim()
  //                 ) {
  //                   window.alert("All fields are required.");
  //                   return;
  //                 }
  
  //                 // Insert new category with current user's pharmacy
  //                 const { error } = await supabase.from("category").insert([
  //                   {
  //                     categoryImage: newCategoryImageUrl,
  //                     category: newCategoryName,
  //                     catInfo: newCategoryInfo,
  //                     pharmacy: profile?.pharmacy,
  //                   },
  //                 ]);
  
  //                 if (error) throw error;
  
  //                 window.alert("New category added successfully!");
  //                 // Reset form fields
  //                 setNewCategoryImage(null);
  //                 setNewCategoryImageUrl("");
  //                 setNewCategoryName("");
  //                 setNewCategoryInfo("");
  //                 // Refresh categories
  //                 fetchInitialData(profile?.pharmacy || "");
  //               } catch (error: any) {
  //                 console.error("Error adding new category:", error.message);
  //                 window.alert(error.message || "Error adding new category. Please try again.");
  //               }
  //             }}
  //           >
  //             {/* Image Input */}
  //             <div style={styles.formGroup}>
  //               <label style={styles.label}>Category Image</label>
  //               {/* Hidden File Input */}
  //               <input
  //                 type="file"
  //                 accept="image/*"
  //                 onChange={handleImageChange}
  //                 style={{ display: "none" }}
  //                 id="category-image-input"
  //               />
  
  //               {/* Upload Image and Copy URL Buttons */}
  //               <div style={{ display: "flex", alignItems: "center" }}>
  //                 <button
  //                   type="button"
  //                   style={styles.uploadButton}
  //                   onClick={() => document.getElementById("category-image-input")?.click()}
  //                 >
  //                   Upload Image
  //                 </button>
  
  //                 <button
  //                   type="button"
  //                   style={styles.copyButton}
  //                   onClick={handleCopy}
  //                   disabled={!newCategoryImageUrl}
  //                 >
  //                   Copy URL
  //                 </button>
  //               </div>
  
  //               {/* Image URL Input */}
  //               <input
  //                 type="text"
  //                 value={newCategoryImageUrl}
  //                 onChange={(e) => setNewCategoryImageUrl(e.target.value)}
  //                 style={styles.input}
  //                 placeholder="Image URL will appear here after upload..."
  //                 readOnly
  //               />
  
  //               {/* Image Preview */}
  //               {newCategoryImageUrl && (
  //                 <img src={newCategoryImageUrl} alt="Category Preview" style={styles.imagePreview} />
  //               )}
  //               {newCategoryImage && !newCategoryImageUrl && (
  //                 <img
  //                   src={URL.createObjectURL(newCategoryImage)}
  //                   alt="Category Preview"
  //                   style={styles.imagePreview}
  //                 />
  //               )}
  //             </div>
  
  //             {/* Category Name */}
  //             <div style={styles.formGroup}>
  //               <label style={styles.label}>Category Name</label>
  //               <input
  //                 type="text"
  //                 value={newCategoryName}
  //                 onChange={(e) => setNewCategoryName(e.target.value)}
  //                 style={styles.input}
  //                 placeholder="Enter Category Name..."
  //                 required
  //               />
  //             </div>
  
  //             {/* Information */}
  //             <div style={styles.formGroup}>
  //               <label style={styles.label}>Information</label>
  //               <textarea
  //                 value={newCategoryInfo}
  //                 onChange={(e) => setNewCategoryInfo(e.target.value)}
  //                 style={styles.textarea}
  //                 placeholder="Enter Information..."
  //                 required
  //               />
  //             </div>
  
  //             {/* Submit Button */}
  //             <button type="submit" style={styles.submitButton} disabled={!newCategoryImageUrl}>
  //               Add Category
  //             </button>
  //           </form>
  //         </div>
  //       </div>
  
  //       {/* Categories Table */}
  //       <div style={styles.tableContainer}>
  //         {filteredCategories.length === 0 ? (
  //           <p style={{ textAlign: "center", color: "#fff" }}>No categories available.</p>
  //         ) : (
  //           <table style={styles.table}>
  //             <thead>
  //               <tr>
  //                 <th style={styles.th}>Image</th>
  //                 <th style={styles.th}>Category</th>
  //                 <th style={styles.th}>Information</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {filteredCategories.map((category) => (
  //                 <tr key={category.id}>
  //                   {/* Image Cell */}
  //                   <td
  //                     style={styles.td}
  //                     onPointerDown={() =>
  //                       handlePointerDown(category.id, "categoryImage", category.categoryImage)
  //                     }
  //                     onPointerUp={handlePointerUpOrLeave}
  //                     onPointerLeave={handlePointerUpOrLeave}
  //                   >
  //                     {editingCell?.id === category.id && editingCell.field === "categoryImage" ? (
  //                       <input
  //                         type="text"
  //                         value={editValue}
  //                         onChange={handleEditChange}
  //                         onBlur={handleEditSubmit}
  //                         onKeyDown={handleKeyDown}
  //                         autoFocus
  //                         style={styles.editInput}
  //                         placeholder="Enter Image URL..."
  //                       />
  //                     ) : (
  //                       <img src={category.categoryImage} alt={category.category} style={styles.imagePreview} />
  //                     )}
  //                   </td>
  
  //                   {/* Category Name Cell */}
  //                   <td
  //                     style={styles.td}
  //                     onPointerDown={() =>
  //                       handlePointerDown(category.id, "category", category.category)
  //                     }
  //                     onPointerUp={handlePointerUpOrLeave}
  //                     onPointerLeave={handlePointerUpOrLeave}
  //                   >
  //                     {editingCell?.id === category.id && editingCell.field === "category" ? (
  //                       <input
  //                         type="text"
  //                         value={editValue}
  //                         onChange={handleEditChange}
  //                         onBlur={handleEditSubmit}
  //                         onKeyDown={handleKeyDown}
  //                         autoFocus
  //                         style={styles.editInput}
  //                       />
  //                     ) : (
  //                       category.category
  //                     )}
  //                   </td>
  
  //                   {/* Information Cell */}
  //                   <td
  //                     style={styles.td}
  //                     onPointerDown={() =>
  //                       handlePointerDown(category.id, "catInfo", category.catInfo)
  //                     }
  //                     onPointerUp={handlePointerUpOrLeave}
  //                     onPointerLeave={handlePointerUpOrLeave}
  //                   >
  //                     {editingCell?.id === category.id && editingCell.field === "catInfo" ? (
  //                       <textarea
  //                         value={editValue}
  //                         onChange={handleEditChange}
  //                         onBlur={handleEditSubmit}
  //                         onKeyDown={handleKeyDown}
  //                         autoFocus
  //                         style={styles.editInput}
  //                       />
  //                     ) : (
  //                       category.catInfo
  //                     )}
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }
  
  // export default Dashboard3;