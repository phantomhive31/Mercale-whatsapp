import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog, DialogContent, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
	messageMedia: {
		objectFit: "cover",
		width: "100%",
		height: 200,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		borderBottomLeftRadius: 8,
		borderBottomRightRadius: 8,
		cursor: "pointer",
		display: "block",
	},

	messageMediaSticker: {
		width: 200,
		height: 200,
	},
	
	messageMediaDeleted: {
		filter: "grayscale(1)",
		opacity: 0.4
	},

	imageError: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f5f5f5",
		color: "#666",
		fontSize: "14px",
		textAlign: "center",
		padding: "20px",
		height: 200,
	},

	modalImage: {
		maxWidth: "90vw",
		maxHeight: "90vh",
		objectFit: "contain",
	},

	modalContent: {
		position: "relative",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
	},

	closeButton: {
		position: "absolute",
		top: 8,
		right: 8,
		zIndex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		color: "white",
		"&:hover": {
			backgroundColor: "rgba(0, 0, 0, 0.7)",
		},
	}
}));

const SimpleImageModal = ({ imageUrl, isDeleted, data }) => {
	const classes = useStyles();
	const [modalOpen, setModalOpen] = useState(false);

	const handleImageClick = () => {
		setModalOpen(true);
	};

	const handleModalClose = () => {
		setModalOpen(false);
	};

	// Log para debug
	console.log("SimpleImageModal renderizando:", {
		imageUrl,
		isDeleted,
		modalOpen
	});

	// Verificar se a URL da imagem é válida
	if (!imageUrl) {
		console.error("URL da imagem não fornecida");
		return (
			<div className={classes.imageError}>
				<p>URL da imagem não fornecida</p>
			</div>
		);
	}

	// Renderizar imagem diretamente
	return (
		<>
			<img
				className={classes.messageMedia}
				src={imageUrl}
				alt="image"
				onClick={handleImageClick}
				onError={(e) => {
					console.error("Erro ao carregar imagem:", imageUrl);
					e.target.style.display = 'none';
					e.target.nextSibling.style.display = 'flex';
				}}
			/>
			
			<div 
				className={classes.imageError}
				style={{ display: 'none' }}
			>
				<p>Erro ao carregar imagem</p>
				<p style={{ fontSize: "12px", marginTop: "5px" }}>
					URL: {imageUrl}
				</p>
			</div>
			
			<Dialog
				open={modalOpen}
				onClose={handleModalClose}
				maxWidth={false}
				fullWidth
				PaperProps={{
					style: {
						backgroundColor: "transparent",
						boxShadow: "none",
					},
				}}
			>
				<DialogContent className={classes.modalContent}>
					<IconButton
						className={classes.closeButton}
						onClick={handleModalClose}
						size="small"
					>
						<Close />
					</IconButton>
					<img
						className={classes.modalImage}
						src={imageUrl}
						alt="image"
					/>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default SimpleImageModal;
