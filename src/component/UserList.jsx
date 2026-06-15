const colors = [
  "#dbeafe|#1d4ed8",
  "#dcfce7|#15803d",
  "#f3e8ff|#7c3aed",
  "#ffedd5|#c2410c",
  "#fce7f3|#be185d",
  "#e0f2fe|#0369a1",
];

const UserList = ({ users, setSelectedUser }) => {
  return (
    <div
      style={{
        width: "240px",
        minWidth: "240px",
        background: "#f8fafc",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e2e8f0",
          background: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#374151",
              textTransform: "uppercase",
            }}
          >
            Online Users
          </span>

          <span
            style={{
              marginLeft: "auto",
              background: "#dbeafe",
              color: "#1d4ed8",
              borderRadius: "12px",
              padding: "2px 8px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {users.length}
          </span>
        </div>
      </div>

      {/* Users */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
        {users.map((user, index) => {
          const [bg, fg] = colors[index % colors.length].split("|");

          return (
            <div
              key={index}
              onClick={() => setSelectedUser(user)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "5px",
                cursor: "pointer",
              }}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: bg,
                    color: fg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                  }}
                >
                  {user.username?.charAt(0)?.toUpperCase()}
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    border: "2px solid white",
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#1e293b",
                  }}
                >
                  {user.username}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#22c55e",
                  }}
                >
                  Online
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;